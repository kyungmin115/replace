package com.replace.service.goods;

import com.replace.domain.goods.GoodsCategory;
import com.replace.repository.goods.GoodsCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsCategoryServiceImpl implements GoodsCategoryService {

    @Autowired
    private GoodsCategoryRepository goodsCategoryRepository;

    @Override
    public List<GoodsCategory> getAllCategories() {
        return goodsCategoryRepository.findAll();
    }
}

