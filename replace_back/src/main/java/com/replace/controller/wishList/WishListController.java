package com.replace.controller.wishList;

import com.replace.dto.wishList.WishListResponseDTO;
import com.replace.service.wishList.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    @PostMapping("/{pid}")
    public ResponseEntity<Void> addToWishList(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String pid) {
        wishListService.addToWishList(userDetails.getUsername(), pid);
        System.out.println(userDetails.getUsername() + pid);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{pid}")
    public ResponseEntity<Void> removeFromWishList(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String pid) {
        wishListService.removeFromWishList(userDetails.getUsername(), pid);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<WishListResponseDTO>> getWishList(@AuthenticationPrincipal UserDetails userDetails) {
        List<WishListResponseDTO> wishList = wishListService.getWishList(userDetails.getUsername());
        return ResponseEntity.ok(wishList);
    }

    @GetMapping("/check/{pid}")
    public ResponseEntity<Boolean> isInWishList(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String pid) {
        boolean result = wishListService.isInWishList(userDetails.getUsername(), pid);
        return ResponseEntity.ok(result);
    }
}
