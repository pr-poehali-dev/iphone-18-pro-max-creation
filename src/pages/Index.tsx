import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Icon from '@/components/ui/icon'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  expiry: string
  description: string
  unit: string
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Свежие овощи",
    price: 299,
    image: "/img/9edcb1fb-621c-4dec-adf0-a8190683473e.jpg",
    category: "vegetables",
    expiry: "25.09.2025",
    description: "Микс из свежих овощей: помидоры, огурцы, морковь",
    unit: "кг"
  },
  {
    id: 2,
    name: "Молочные продукты",
    price: 189,
    image: "/img/6a310d21-b130-4691-853e-0049d7a3ec75.jpg",
    category: "dairy",
    expiry: "28.09.2025",
    description: "Свежее молоко, творог, сметана высшего качества",
    unit: "набор"
  },
  {
    id: 3,
    name: "Хлебобулочные изделия",
    price: 159,
    image: "/img/09b12154-8186-40e3-a02e-8826025969c2.jpg",
    category: "bakery",
    expiry: "22.09.2025",
    description: "Свежий хлеб, круассаны, выпечка от пекарни",
    unit: "набор"
  },
  {
    id: 4,
    name: "Органические фрукты",
    price: 449,
    image: "/img/9edcb1fb-621c-4dec-adf0-a8190683473e.jpg",
    category: "fruits",
    expiry: "30.09.2025",
    description: "Сезонные фрукты: яблоки, груши, бананы",
    unit: "кг"
  },
  {
    id: 5,
    name: "Мясные деликатесы",
    price: 699,
    image: "/img/6a310d21-b130-4691-853e-0049d7a3ec75.jpg",
    category: "meat",
    expiry: "24.09.2025",
    description: "Отборное мясо, колбасы, деликатесы",
    unit: "кг"
  },
  {
    id: 6,
    name: "Морепродукты",
    price: 899,
    image: "/img/09b12154-8186-40e3-a02e-8826025969c2.jpg",
    category: "seafood",
    expiry: "21.09.2025",
    description: "Свежая рыба, креветки, морские деликатесы",
    unit: "кг"
  }
]

const categories = [
  { id: 'all', name: 'Все товары', icon: 'Grid3X3' },
  { id: 'vegetables', name: 'Овощи', icon: 'Carrot' },
  { id: 'fruits', name: 'Фрукты', icon: 'Apple' },
  { id: 'dairy', name: 'Молочное', icon: 'Milk' },
  { id: 'bakery', name: 'Выпечка', icon: 'Croissant' },
  { id: 'meat', name: 'Мясо', icon: 'Beef' },
  { id: 'seafood', name: 'Рыба', icon: 'Fish' }
]

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryFee = () => {
    const total = getTotalPrice()
    return total >= 1000 ? 0 : 199
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate.split('.').reverse().join('-'))
    const today = new Date()
    const daysDifference = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysDifference <= 3
  }

  return (
    <div className="min-h-screen bg-background font-open-sans">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-montserrat font-bold text-primary">Вкусно & Свежо</h1>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-96">
              <SheetHeader>
                <SheetTitle className="font-montserrat">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.price} ₽/{item.unit}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Товары:</span>
                        <span>{getTotalPrice()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Доставка:</span>
                        <span>{getDeliveryFee() === 0 ? 'Бесплатно' : `${getDeliveryFee()} ₽`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Итого:</span>
                        <span>{getTotalPrice() + getDeliveryFee()} ₽</span>
                      </div>
                      <Button className="w-full mt-4 bg-accent hover:bg-accent/90" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-primary mb-6">
            Свежие продукты с доставкой
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Отборные продукты питания с контролем качества и сроков годности. 
            Доставим в течение 2 часов.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-accent" />
              <span>Доставка за 2 часа</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-accent" />
              <span>Контроль качества</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Truck" size={16} className="text-accent" />
              <span>Бесплатно от 1000 ₽</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <main className="container mx-auto px-4 py-12">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-8">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon name={category.icon} size={16} />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {isExpiringSoon(product.expiry) && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Скоро истечет
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-montserrat font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                        <span className="text-sm text-muted-foreground">за {product.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>до {product.expiry}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-accent hover:bg-accent/90"
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-xl mb-4">Вкусно & Свежо</h3>
              <p className="text-sm opacity-90">
                Лучшие продукты питания с быстрой доставкой и гарантией качества.
              </p>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={14} />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} />
                  <span>info@vkusno-svezho.ru</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>Москва, ул. Примерная, 123</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold mb-4">Условия</h4>
              <div className="space-y-2 text-sm">
                <p>• Доставка от 199 ₽</p>
                <p>• Бесплатно от 1000 ₽</p>
                <p>• Время доставки: 2-4 часа</p>
                <p>• Оплата наличными и картой</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Вкусно & Свежо. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}