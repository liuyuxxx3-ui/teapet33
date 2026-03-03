import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, Search, Filter } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/stores/appStore';
import { getCategories, getProductsByCategory, getPointsProducts } from '@/data/products';
import type { Product } from '@/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPointsOnly, setShowPointsOnly] = useState(false);
  const { user, addToCart } = useAppStore();
  
  const categories = getCategories();
  const displayProducts = showPointsOnly 
    ? getPointsProducts() 
    : getProductsByCategory(activeCategory);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setSelectedProduct(null);
  };
  
  return (
    <MobileLayout
      navBarProps={{ title: '茶宠商城', showBack: true }}
      className="bg-[#F5F0E6]"
    >
      <div className="px-4 py-3 pb-20">
        {/* 搜索栏 */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8B7A]" />
            <input 
              type="text"
              placeholder="搜索商品..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-sm border border-[#E8E2D5] focus:outline-none focus:border-[#8FBC6B]"
            />
          </div>
          <motion.button
            className={`px-2.5 rounded-xl flex items-center gap-1 text-xs ${
              showPointsOnly ? 'bg-[#8FBC6B] text-white' : 'bg-white text-[#9A8B7A] border border-[#E8E2D5]'
            }`}
            onClick={() => setShowPointsOnly(!showPointsOnly)}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={14} />
            积分
          </motion.button>
          <motion.button
            className="px-2.5 bg-white rounded-xl text-[#9A8B7A] border border-[#E8E2D5]"
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
          </motion.button>
        </div>
        
        {/* 分类标签 */}
        {!showPointsOnly && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#8FBC6B] text-white'
                    : 'bg-white text-[#9A8B7A] border border-[#E8E2D5]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* 积分兑换提示 */}
        {showPointsOnly && (
          <div className="mb-3">
            <div 
              className="rounded-xl p-3 text-white"
              style={{ background: 'linear-gradient(135deg, #8FBC6B 0%, #7A9E6E 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-80">我的积分</p>
                  <p className="text-xl font-bold">{user.points}</p>
                </div>
                <Sparkles size={24} className="opacity-50" />
              </div>
            </div>
          </div>
        )}
        
        {/* 商品列表 */}
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="cozy-card overflow-hidden card-hover"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-[#F5F0E6] relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.points && (
                    <div className="absolute top-1.5 left-1.5 bg-[#8FBC6B] text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Sparkles size={8} />
                      可兑换
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-[#5C4A3A] text-xs line-clamp-1">{product.name}</h3>
                  <p className="text-[10px] text-[#9A8B7A] mt-0.5 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#8FBC6B]">¥{product.price}</span>
                      {product.points && (
                        <span className="text-[10px] text-[#9A8B7A]">或{product.points}积分</span>
                      )}
                    </div>
                    <motion.button
                      className="w-6 h-6 bg-[#8FBC6B] rounded-full flex items-center justify-center"
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={10} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 商品详情弹窗 */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[320px] bg-[#FFFEF8] rounded-3xl p-0 border-2 border-[#E8E2D5]">
          {selectedProduct && (
            <>
              <div className="aspect-square bg-[#F5F0E6]">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-bold text-[#5C4A3A] mb-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-[#9A8B7A] mb-2">{selectedProduct.description}</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-[#8FBC6B]">¥{selectedProduct.price}</span>
                  </div>
                  {selectedProduct.points && (
                    <div className="flex items-center gap-0.5 text-[#9A8B7A] text-xs">
                      <span>或</span>
                      <Sparkles size={10} className="text-[#C4A77D]" />
                      <span>{selectedProduct.points}积分</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-3 text-[10px] text-[#9A8B7A]">
                  <span>库存: {selectedProduct.stock}</span>
                  <span>·</span>
                  <span>销量: {selectedProduct.sales}</span>
                  <span>·</span>
                  <span>评分: {selectedProduct.rating}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 leaf-btn text-white py-2.5 rounded-xl font-medium text-sm"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    加入购物车
                  </motion.button>
                  {selectedProduct.points && (
                    <motion.button
                      className="flex-1 wood-btn text-white py-2.5 rounded-xl font-medium text-sm"
                      whileTap={{ scale: 0.98 }}
                    >
                      积分兑换
                    </motion.button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
