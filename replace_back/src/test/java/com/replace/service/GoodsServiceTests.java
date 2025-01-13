package com.replace.service;

import com.replace.service.goods.GoodsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class GoodsServiceTests {
    @Autowired
    private GoodsService goodsService;

    @Test
    public void testRandomViewCountForAllGoods () {
        // 모든 굿즈의 조회수를 랜덤 값으로 설정
        goodsService.setRandomViewCountForAllGoods();
    }

}
