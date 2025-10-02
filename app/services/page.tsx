import Image from 'next/image'
import { Search, Target, GraduationCap, PieChart, Scale } from 'lucide-react'

const services = [
  {
    icon: <Search className="w-12 h-12 text-primary-600" />,
    title: 'Research',
    description: 'We conduct comprehensive research on nutritional needs and food trends to develop products that meet our customers\' health requirements.',
    features: [
      'Nutritional analysis',
      'Market research',
      'Consumer studies',
      'Product development research'
    ]
  },
  {
    icon: <Target className="w-12 h-12 text-primary-600" />,
    title: 'Strategic Plan Design',
    description: 'We help organizations and individuals create strategic plans for healthy eating and nutrition management.',
    features: [
      'Custom meal planning',
      'Nutritional goal setting',
      'Implementation strategies',
      'Progress monitoring'
    ]
  },
  {
    icon: <GraduationCap className="w-12 h-12 text-primary-600" />,
    title: 'Trainings',
    description: 'We provide comprehensive training programs on nutrition, healthy cooking, and food safety practices.',
    features: [
      'Nutrition education',
      'Cooking workshops',
      'Food safety training',
      'Healthy lifestyle seminars'
    ]
  },
  {
    icon: <PieChart className="w-12 h-12 text-primary-600" />,
    title: 'Nutrient Profiling',
    description: 'Our expert nutritionists analyze and profile the nutritional content of foods to help you make informed choices.',
    features: [
      'Detailed nutrient analysis',
      'Calorie counting',
      'Macro and micronutrient breakdown',
      'Health recommendations'
    ]
  },
  {
    icon: <Scale className="w-12 h-12 text-primary-600" />,
    title: 'Weight Management',
    description: 'We offer personalized weight management programs that combine healthy eating with our nutritious bakery products.',
    features: [
      'Personalized meal plans',
      'Progress tracking',
      'Healthy product recommendations',
      'Lifestyle coaching'
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Comprehensive nutritional services and healthy food solutions
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Vitafoods360, we provide a comprehensive range of services designed to support 
              your health and nutritional goals through expert guidance and quality products.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600">
              Our systematic approach ensures the best results for your health and nutrition goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">
                We start with a comprehensive consultation to understand your needs and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Analysis</h3>
              <p className="text-gray-600">
                Our experts analyze your current situation and create a customized plan.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Implementation</h3>
              <p className="text-gray-600">
                We implement the plan with our quality products and expert guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitoring</h3>
              <p className="text-gray-600">
                We continuously monitor progress and adjust the plan as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our services and how we can help you achieve your health goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-secondary">
              Get Started
            </a>
            <a href="/products" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              View Products
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
