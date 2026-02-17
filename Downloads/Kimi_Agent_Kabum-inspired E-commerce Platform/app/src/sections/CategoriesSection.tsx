import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Mouse, Laptop, Monitor, Armchair, Wifi, ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Mouse,
  Laptop,
  Monitor,
  Armchair,
  Wifi,
};

export function CategoriesSection() {
  return (
    <section className="py-16 bg-[#1A1A1A]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Categorias em <span className="text-[#FF6600]">Destaque</span>
            </h2>
            <p className="text-gray-400">Explore nossas princip categorias de produtos</p>
          </div>
          <Link
            to="/produtos"
            className="hidden sm:flex items-center gap-2 text-[#FF6600] hover:text-[#FF8533] font-medium transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid de categorias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Cpu;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/produtos?categoria=${category.slug}`}>
                  <div className="group relative bg-[#2C2C2C] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#3C3C3C] hover:shadow-xl hover:shadow-orange-500/10 border border-transparent hover:border-[#FF6600]/30">
                    {/* Imagem de fundo */}
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-category.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C] via-[#2C2C2C]/50 to-transparent" />
                    </div>

                    {/* Conteúdo */}
                    <div className="relative p-4 -mt-8">
                      <div className="w-12 h-12 bg-[#FF6600] rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#FF6600] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {category.productCount} produtos
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Link mobile */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-[#FF6600] hover:text-[#FF8533] font-medium transition-colors"
          >
            Ver todas as categorias
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
