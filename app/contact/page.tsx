import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import Newsletter from '@/components/Newsletter'

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6 text-primary-600" />,
    title: 'Address',
    details: [
      '16 PLAS George Drive, Leicester Peek.'
    ]
  },
  {
    icon: <Phone className="w-6 h-6 text-primary-600" />,
    title: 'Phone',
    details: [
      '+23279055199',
      '+23232906183'
    ]
  },
  {
    icon: <Mail className="w-6 h-6 text-primary-600" />,
    title: 'Email',
    details: [
      'vitafoods360@gmail.com',
    ]
  },
  {
    icon: <Clock className="w-6 h-6 text-primary-600" />,
    title: 'Business Hours',
    details: [
      'Monday - Sunday: 24 HOURS'
    ]
  }
]

const outlets = [
  {
    name: 'Main Branch',
    address: '123 Main Street, Freetown',
    phone: '+232 76 123 456',
    hours: '7:00 AM - 7:00 PM (Mon-Fri)'
  },
  {
    name: 'Lumley Branch',
    address: '456 Lumley Road, Freetown',
    phone: '+232 88 987 654',
    hours: '8:00 AM - 6:00 PM (Mon-Sat)'
  },
  {
    name: 'Wilberforce Branch',
    address: '789 Wilberforce Street, Freetown',
    phone: '+232 99 456 789',
    hours: '7:00 AM - 7:00 PM (Mon-Fri)'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Get in touch with us for orders, inquiries, or any questions about our products and services
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h3>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-6">
                <p className="text-gray-500">Map integration coming soon</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Main Location</h4>
                  <p className="text-gray-600">16 PLAS George Drive, Leicester Peek, Freetown.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outlet Locations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Outlets
            </h2>
            <p className="text-xl text-gray-600">
              Visit us at any of our convenient locations across Freetown
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {outlets.map((outlet, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold mb-3">{outlet.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">{outlet.address}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">{outlet.phone}</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">{outlet.hours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our products and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Do you deliver?</h3>
              <p className="text-gray-600">
                Yes, we offer delivery services within Freetown. Contact us for delivery options and pricing.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Are your products healthy?</h3>
              <p className="text-gray-600">
                Absolutely! We use whole grains, natural ingredients, and avoid artificial preservatives in our products.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Do you take custom orders?</h3>
              <p className="text-gray-600">
                Yes, we accept custom orders for special occasions. Please contact us 3 days in advance for special orders.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept cash, OrangeMoney, AfriMoney, and bank card payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}
