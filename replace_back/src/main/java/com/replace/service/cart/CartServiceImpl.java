package com.replace.service.cart;

import com.replace.domain.cart.Cart;
import com.replace.domain.cart.CartItem;
import com.replace.domain.goods.Goods;
import com.replace.domain.member.Member;
import com.replace.dto.cart.CartItemDTO;
import com.replace.dto.cart.CartItemListDTO;
import com.replace.repository.cart.CartItemRepository;
import com.replace.repository.cart.CartRepository;
import com.replace.repository.goods.GoodsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final GoodsRepository goodsRepository;

    @Override
    public List<CartItemListDTO> addItemToCart(CartItemDTO cartItemDTO, String ownerId) {
        validateOwner(ownerId);

        Long goodsId = cartItemDTO.getGoodsId();
        int quantity = cartItemDTO.getQuantity();
        Long cartItemId = cartItemDTO.getCartItemId();

        if (cartItemId != null) {
            // 장바구니 아이템이 이미 존재하는 경우
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 장바구니 아이템을 찾을 수 없습니다."));
            validateCartOwner(cartItem.getCart(), ownerId);
            cartItem.changeQuantity(quantity);
            cartItemRepository.save(cartItem);
            return mapToCartItemListDTO(getCart(ownerId));
        }

        // 장바구니가 없으면 새로 생성
        Cart cart = getCart(ownerId);

        // 상품 조회
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다. ID: " + goodsId));

        // 이미 장바구니에 해당 상품이 존재하는지 확인
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartAndGoods(cart, goods);
        log.info(existingCartItem);
        if (existingCartItem.isPresent()) {
            // 이미 장바구니에 존재하면 수량 업데이트
            CartItem cartItem = existingCartItem.get();
            cartItem.changeQuantity(quantity); // 수량 변경
            cartItemRepository.save(cartItem);  // 업데이트
        } else {
            // 새로운 CartItem 생성
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .goods(goods)
                    .cartItemQuantity(quantity)
                    .selected(true)
                    .build();
            cartItemRepository.save(cartItem);  // 새 아이템 저장
        }

        return mapToCartItemListDTO(getCart(ownerId));
    }

    @Override
    public List<CartItemListDTO> removeItemFromCart(Long cartItemId, String ownerId) {
        validateOwner(ownerId);
        // 장바구니 아이템 삭제
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템을 찾을 수 없습니다. ID: " + cartItemId));

        validateCartOwner(cartItem.getCart(), ownerId);
        cartItemRepository.delete(cartItem);

        return mapToCartItemListDTO(cartItem.getCart());
    }

    @Override
    public List<CartItemListDTO> removeSelectedItems(String ownerId) {
        validateOwner(ownerId);
        // 장바구니 조회
        Cart cart = getCart(ownerId);
        // 선택된 아이템들 조회 및 삭제
        List<CartItem> selectedItems = cartItemRepository.findByCartAndSelectedTrue(cart);

        if (selectedItems.isEmpty()) {
            throw new IllegalArgumentException("선택된 장바구니 아이템이 없습니다.");
        }
        cartItemRepository.deleteAll(selectedItems);

        return mapToCartItemListDTO(cart);
    }

    @Override
    public List<CartItemListDTO> getCartItems(String ownerId) {
        validateOwner(ownerId);
        // 장바구니 조회
        Cart cart = getCart(ownerId);
        // 장바구니에 있는 아이템들 조회
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        // selected 값을 true로 설정하고 저장
        cartItems.forEach(cartItem -> {
            cartItem.changeSelected(true);
            cartItemRepository.save(cartItem); // 변경된 엔티티 저장
        });

        // CartItemListDTO 생성 후 반환
        return mapToCartItemListDTO(cart);
    }

    @Override
    public List<CartItemListDTO> updateItemSelection(Long cartItemId, boolean selected, String ownerId) {
        validateOwner(ownerId);
        // CartItem을 DB에서 조회
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템을 찾을 수 없습니다."));
        validateCartOwner(cartItem.getCart(), ownerId);
        // 아이템의 선택 상태를 업데이트
        cartItem.changeSelected(selected);
        cartItemRepository.save(cartItem); // DB에 반영

        // 선택된 항목만 반환하도록 처리 (전체 장바구니를 다시 불러오는 것보다 효율적)
        return mapToCartItemListDTO(cartItem.getCart());
    }

    @Override
    public List<CartItemListDTO> selectAllItems(boolean selectAll, String ownerId) {
        validateOwner(ownerId);
        // 장바구니 조회
        Cart cart = cartRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니를 찾을 수 없습니다."));
        // 장바구니에 있는 모든 아이템 조회
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        // 전체 선택/해제 처리
        for (CartItem cartItem : cartItems) {
            cartItem.changeSelected(selectAll);  // selectAll이 true면 모두 선택, false면 모두 해제
            cartItemRepository.save(cartItem);
        }

        // 선택된 항목만 반환하도록 처리 (전체 장바구니를 다시 불러오는 것보다 효율적)
        return mapToCartItemListDTO(cart);
    }

    // 장바구니 아이템 수량 계산
    @Override
    public int getTotalItemQuantity(String ownerId) {
        // 장바구니 조회
        Cart cart = getCart(ownerId);
        // 장바구니에 있는 아이템들 조회
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        // CartItem -> CartItemDTO 변환
        List<CartItemDTO> cartItemDTOList = cartItems.stream()
                .map(this::entityToCartItemDTO)
                .collect(Collectors.toList());

        // 수량 합산
        return calculateTotalQuantity(cartItemDTOList);
    }

    private Cart getCart(String ownerId) {
        // 장바구니 조회 (없으면 생성)
        Optional<Cart> result = cartRepository.findByOwnerId(ownerId);
        if (result.isEmpty()) {
            log.info("Cart is not exist for User: " + ownerId);
            Member member = Member.builder().id(ownerId).build();
            Cart newCart = Cart.builder().owner(member).build();
            return cartRepository.save(newCart);
        }
        return result.get();
    }

    private void validateOwner(String ownerId) {
        if (ownerId == null || ownerId.isEmpty()) {
            throw new AccessDeniedException("인증되지 않은 사용자입니다.");
        }
    }

    private void validateCartOwner(Cart cart, String ownerId) {
        if (!cart.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("해당 장바구니에 접근할 권한이 없습니다.");
        }
    }

    // CartItemEntity -> CartItemDTO 변환
    private CartItemDTO entityToCartItemDTO(CartItem cartItem) {
        return CartItemDTO.builder()
                .cartItemId(cartItem.getCartItemId())
                .goodsId(cartItem.getGoods().getGoodsId())
                .goodsName(cartItem.getGoods().getGoodsName())
                .goodsImgUrl(cartItem.getGoods().getGoodsImgUrl())
                .categoryName(cartItem.getGoods().getGoodsCategory().getGoodsCategoryName())
                .goodsPrice(cartItem.getGoods().getGoodsPrice())
                .quantity(cartItem.getCartItemQuantity())
                .selected(cartItem.isSelected())
                .build();
    }

    // CartEntity -> CartItemListDTO 변환 (장바구니 상태를 반환할 때)
    private List<CartItemListDTO> mapToCartItemListDTO(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        // CartItem -> CartItemDTO 변환
        List<CartItemDTO> cartItemDTOList = cartItems.stream()
                .map(this::entityToCartItemDTO)
                .collect(Collectors.toList());

        // totalPrice와 totalQuantity 계산
        int totalPrice = calculateTotalPrice(cartItemDTOList);
        int totalQuantity = calculateTotalQuantity(cartItemDTOList);

        // DTO 생성 및 반환
        CartItemListDTO cartItemListDTO = CartItemListDTO.builder()
                .cartId(cart.getCartId())
                .ownerId(cart.getOwner().getId())
                .totalPrice(totalPrice)
                .totalQuantity(totalQuantity)
                .cartItemDTOList(cartItemDTOList)
                .build();

        return List.of(cartItemListDTO);
    }

    private int calculateTotalPrice(List<CartItemDTO> items) {
        return items.stream()
                .mapToInt(item -> item.getGoodsPrice() * item.getQuantity())
                .sum();
    }

    private int calculateTotalQuantity(List<CartItemDTO> items) {
        return items.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();
    }

}
