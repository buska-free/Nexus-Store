import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogOut, Edit2, Trash2, DollarSign, Percent, Eye, EyeOff } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function AdminPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ price: 0, discount: 0, discountType: 'percentage' as 'percentage' | 'fixed' });
  
  const { isAuthenticated, login, logout, applyDiscount, removeDiscount, getProductPrice, resetPrices, productOverrides, migrateFromLegacy } = useAdminStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast.success('Autenticado com sucesso!');
      setPassword('');
    } else {
      toast.error('Senha incorreta!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Deslogado com sucesso!');
  };

  const handleApplyDiscount = (productId: string) => {
    if (editData.discount < 0) {
      toast.error('Desconto não pode ser negativo');
      return;
    }

    if (editData.discountType === 'percentage' && editData.discount > 100) {
      toast.error('Desconto percentual não pode ser maior que 100%');
      return;
    }

    applyDiscount(productId, editData.discount, editData.discountType);
    toast.success(`Desconto aplicado: ${editData.discount}${editData.discountType === 'percentage' ? '%' : 'R$'}`);
    setEditingProductId(null);
    setEditData({ price: 0, discount: 0, discountType: 'percentage' });
  };

  const handleRemoveDiscount = (productId: string) => {
    removeDiscount(productId);
    toast.success('Desconto removido!');
  };

  const handleResetAll = () => {
    if (confirm('Tem certeza? Isso removerá todos os descontos e alterações de preço.')) {
      resetPrices();
      toast.success('Todos os preços foram resetados!');
    }
  };

  const handleMigrate = () => {
    const count = migrateFromLegacy();
    if (count > 0) {
      toast.success(`✅ Migração concluída! ${count} produtos importados do sistema antigo.`);
    } else {
      toast.info('Nenhum produto com desconto para migrar.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#2C2C2C] rounded-xl p-8 border border-[#4A4A4A]">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-[#FF6600]/20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#FF6600]" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Painel Administrativo</h1>
            <p className="text-gray-400 text-center mb-6">Área restrita - Acesso apenas para administradores</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Senha de Acesso</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    className="bg-[#1A1A1A] border-[#4A4A4A] text-white pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF6600] hover:bg-[#E55A00] text-white font-semibold"
              >
                Acessar Painel
              </Button>
            </form>

            <p className="text-gray-500 text-xs mt-4 text-center">Dica: A senha padrão é "admin123"</p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-gray-400">Gerencie preços e descontos dos produtos</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleMigrate}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              🔄 Importar Sistema Antigo
            </Button>
            <Button
              variant="outline"
              onClick={handleResetAll}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Resetar Tudo
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[#2C2C2C] rounded-lg p-4 border border-[#4A4A4A]">
            <p className="text-gray-400 text-sm">Total de Produtos</p>
            <p className="text-2xl font-bold text-white mt-2">{products.length}</p>
          </div>
          <div className="bg-[#2C2C2C] rounded-lg p-4 border border-[#4A4A4A]">
            <p className="text-gray-400 text-sm">Produtos com Desconto</p>
            <p className="text-2xl font-bold text-[#FF6600] mt-2">{productOverrides.size}</p>
          </div>
          <div className="bg-[#2C2C2C] rounded-lg p-4 border border-[#4A4A4A]">
            <p className="text-gray-400 text-sm">Economia Total (Aprox.)</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              {formatPrice(
                Array.from(productOverrides.values()).reduce((sum, override) => {
                  if (override.isActive) {
                    const product = products.find(p => p.id === override.productId);
                    if (product) {
                      return sum + (product.price - override.currentPrice);
                    }
                  }
                  return sum;
                }, 0)
              )}
            </p>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2C2C2C] rounded-xl border border-[#4A4A4A] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#4A4A4A] bg-[#1A1A1A]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Produto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Preço Original</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Preço Atual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Desconto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Economia</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const pricing = getProductPrice(product.id);
                  const savings = pricing.originalPrice - pricing.currentPrice;
                  const hasDiscount = productOverrides.has(product.id) && productOverrides.get(product.id)?.isActive;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-[#4A4A4A] hover:bg-[#3C3C3C]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="text-white font-medium text-sm">{product.name}</p>
                            <p className="text-gray-400 text-xs">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{formatPrice(pricing.originalPrice)}</td>
                      <td className="px-6 py-4 text-white font-semibold">{formatPrice(pricing.currentPrice)}</td>
                      <td className="px-6 py-4">
                        {hasDiscount ? (
                          <span className="inline-block bg-[#FF6600]/20 text-[#FF6600] px-3 py-1 rounded text-sm font-medium">
                            {pricing.discount}{pricing.discountType === 'percentage' ? '%' : 'R$'}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Sem desconto</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {savings > 0 ? (
                          <span className="text-green-400 font-medium">{formatPrice(savings)}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProductId(product.id);
                                  setEditData({ price: pricing.currentPrice, discount: pricing.discount, discountType: pricing.discountType as 'percentage' | 'fixed' });
                                }}
                                className="border-[#4A4A4A] text-[#FF6600] hover:bg-[#FF6600]/10"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#2C2C2C] border-[#4A4A4A]">
                              <DialogHeader>
                                <DialogTitle className="text-white">Editar {product.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white mb-2 block">Tipo de Desconto</Label>
                                  <div className="flex gap-2">
                                    <Button
                                      variant={editData.discountType === 'percentage' ? 'default' : 'outline'}
                                      onClick={() => setEditData({ ...editData, discountType: 'percentage' })}
                                      className={editData.discountType === 'percentage' ? 'bg-[#FF6600]' : 'border-[#4A4A4A] text-white'}
                                    >
                                      <Percent className="w-4 h-4 mr-2" />
                                      Percentual
                                    </Button>
                                    <Button
                                      variant={editData.discountType === 'fixed' ? 'default' : 'outline'}
                                      onClick={() => setEditData({ ...editData, discountType: 'fixed' })}
                                      className={editData.discountType === 'fixed' ? 'bg-[#FF6600]' : 'border-[#4A4A4A] text-white'}
                                    >
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Fixo
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-white mb-2 block">
                                    {editData.discountType === 'percentage' ? 'Desconto (%)' : 'Desconto (R$)'}
                                  </Label>
                                  <Input
                                    type="number"
                                    value={editData.discount}
                                    onChange={(e) => setEditData({ ...editData, discount: parseFloat(e.target.value) || 0 })}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    className="bg-[#1A1A1A] border-[#4A4A4A] text-white"
                                  />
                                </div>

                                <div className="bg-[#1A1A1A] rounded p-3 border border-[#4A4A4A]">
                                  <p className="text-gray-400 text-sm mb-1">Preço Original: {formatPrice(pricing.originalPrice)}</p>
                                  <p className="text-[#FF6600] text-lg font-bold">
                                    Preço com Desconto: {formatPrice(
                                      editData.discountType === 'percentage'
                                        ? pricing.originalPrice * (1 - editData.discount / 100)
                                        : Math.max(0, pricing.originalPrice - editData.discount)
                                    )}
                                  </p>
                                  <p className="text-green-400 text-sm mt-2">
                                    Economia: {formatPrice(
                                      editData.discountType === 'percentage'
                                        ? pricing.originalPrice * (editData.discount / 100)
                                        : editData.discount
                                    )}
                                  </p>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  {hasDiscount && (
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleRemoveDiscount(product.id);
                                        setEditingProductId(null);
                                      }}
                                      className="flex-1"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remover Desconto
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => {
                                      handleApplyDiscount(product.id);
                                      setEditingProductId(null);
                                    }}
                                    className="flex-1 bg-[#FF6600] hover:bg-[#E55A00]"
                                  >
                                    Aplicar Desconto
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {hasDiscount && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveDiscount(product.id)}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
