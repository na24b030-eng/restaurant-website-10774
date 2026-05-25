import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen font-sans antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

function Navbar() {
  const location = window.location.pathname
  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/reservation', label: 'Reservation' },
    { to: '/order', label: 'Order' },
    { to: '/account', label: 'Account' }
  ]
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Gourmet Hub
        </span>
        <div>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-gray-600 hover:text-indigo-600 font-medium transition-all duration-200 text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                location === l.to ? 'text-indigo-600' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Home() {
  const navigate = useNavigate()
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden pt-20">
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"></div>
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-8">
          <span>Welcome</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6">
          Taste the Extraordinary
        </h1>
        <p className="text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed mb-10">
          Explore our chefcrafted menu, reserve a table, or order straight to your door.
        </p>
        <button
          className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl shadow-indigo-500/25"
          onClick={() => navigate('/menu')}
        >
          Browse Menu
        </button>
      </div>
    </section>
  )
}

function MenuPage() {
  const [menu, setMenu] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('https://restaurant-website-api.onrender.com/api/menu')
        const data = await res.json()
        setMenu(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const filtered = menu?.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) || []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      <h2 className="text-4xl font-black text-gray-900 mb-3">Our Menu</h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>

      <input
        type="text"
        placeholder="Search dishes..."
        className="w-full mb-8 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-indigo-600 font-semibold">${item.price}</span>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MenuDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`https://restaurant-website-api.onrender.com/api/menu/${id}`)
        const data = await res.json()
        setItem(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  if (loading) return <Loading />
  if (!item) return <Empty />

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      <h2 className="text-4xl font-black text-gray-900 mb-3">{item.name}</h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <p className="text-lg text-gray-700 mb-4">{item.description}</p>
        <p className="text-2xl font-bold text-indigo-600 mb-6">${item.price}</p>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-200">
          Add to Order
        </button>
      </div>
    </div>
  )
}

function ReservationPage() {
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('https://restaurant-website-api.onrender.com/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed')
      showToast('Reservation created!', 'success')
      setForm({ name: '', email: '', date: '', time: '', guests: '' })
    } catch (err) {
      showToast('Error creating reservation', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      <h2 className="text-4xl font-black text-gray-900 mb-3">Reserve a Table</h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Reservation Form</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 mt-1"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 mt-1"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
            <input
              name="date"
              type="date"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 mt-1"
              value={form.date}
              onChange={handleChange}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Time
            <input
              name="time"
              type="time"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 mt-1"
              value={form.time}
              onChange={handleChange}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Guests
            <input
              name="guests"
              type="number"
              min="1"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 mt-1"
              value={form.guests}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-200"
          >
            {loading ? 'Submitting...' : 'Reserve'}
          </button>
        </form>
      </div>
    </div>
  )
}

function OrderPage() {
  const [items, setItems] = useState([])
  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('https://restaurant-website-api.onrender.com/api/menu')
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const addToOrder = item => {
    setOrder(prev => [...prev, item])
    showToast(`${item.name} added`, 'success')
  }

  const placeOrder = async () => {
    if (order.length === 0) {
      showToast('Add items before ordering', 'error')
      return
    }
    setPlacing(true)
    try {
      const res = await fetch('https://restaurant-website-api.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: order.map(i => i.id) })
      })
      if (!res.ok) throw new Error('Failed')
      showToast('Order placed!', 'success')
      setOrder([])
    } catch (e) {
      showToast('Error placing order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      <h2 className="text-4xl font-black text-gray-900 mb-3">Online Ordering</h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 cursor-pointer"
            >
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-indigo-600 font-semibold">${item.price}</span>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200"
                    onClick={() => addToOrder(item)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Order</h3>
        {order.length === 0 ? (
          <p className="text-gray-500">No items selected.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {order.map((i, idx) => (
              <li key={idx} className="flex justify-between text-gray-700">
                <span>{i.name}</span>
                <span>${i.price}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={placeOrder}
          disabled={placing}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-200"
        >
          {placing ? 'Placing...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
      <h2 className="text-4xl font-black text-gray-900 mb-3">Account</h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"></div>
      <p className="text-gray-600">Account management features are coming soon.</p>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Gourmet Hub
        </span>
        <p className="text-gray-400 mt-2 max-w-sm leading-relaxed">
          Delightful dining experiences delivered to your doorstep. Join us for unforgettable flavors.
        </p>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
           2026 Gourmet Hub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  )
}

function Empty() {
  return (
    <div className="text-center py-24">
      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl"></span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Nothing here yet</h3>
      <p className="text-gray-500">Get started by adding your first item</p>
    </div>
  )
}

function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts(prev => prev.filter(t => Date.now() - t.time < 3000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  window.showToast = (msg, type) => {
    setToasts(prev => [...prev, { id: Date.now(), msg, type, time: Date.now() }])
  }

  return (
    <>
      {toasts.map(t => (
        <div
          key={t.id}
          className={t.type === 'success' ? 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold animate-bounce z-50' : 'fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold z-50'}
        >
          {t.msg}
        </div>
      ))}
    </>
  )
}

function showToast(message, type) {
  if (window.showToast) {
    window.showToast(message, type)
  }
}