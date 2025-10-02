import Image from 'next/image'
import { Heart, Users, Award, Target } from 'lucide-react'
import StaffCard from '@/components/StaffCard'

const staff = [
  {
    id: 1,
    name: 'Dr. Sibida George',
    role: 'Founder & CEO',
    bio: 'Passionate about bringing healthy, fresh bakery products to our community. With over 10 years of experience in food service and nutrition.',
    image_url: '/images/staff/aminata-bangura.jpg',
  },
  {
    id: 2,
    name: 'Ms. Sarah Wai',
    role: 'Board Secretary',
    bio: 'Master baker with expertise in traditional and modern baking techniques. Committed to quality and consistency in every product.',
    image_url: '/images/staff/mohamed-kamara.jpg',
  },
  {
    id: 3,
    name: 'Patrick .J. KaiKai',
    role: 'Board Chairman',
    bio: 'Certified nutritionist focused on creating healthy bakery options. Specializes in whole-grain and low-sugar alternatives.',
    image_url: '/images/staff/fatima-sesay.jpg',
  },
  {
    id: 4,
    name: 'Abdulai Bun-Wai',
    role: 'Board Vice Chairman & Operations Director',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 5,
    name: 'Fr. Patrick .L. George',
    role: 'Board Member ',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 6,
    name: 'Thomas .P. George',
    role: 'Board Member',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 7,
    name: 'Sarah .H. George',
    role: 'Board Member',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 8,
    name: 'Gbenga Olaiya',
    role: 'Board Member',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 9,
    name: 'Dr. Regina Saffa',
    role: 'Board Member',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 10,
    name: 'Christina Turay',
    role: 'Board Member & Operational Manager',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
  {
    id: 11,
    name: 'Mary Bindi',
    role: 'Board Member',
    bio: 'Ensures smooth operations and maintains the highest standards of food safety and quality control.',
    image_url: '/images/staff/ibrahim-conteh.jpg',
  },
]

const values = [
  {
    icon: <Heart className="w-8 h-8 text-primary-600" />,
    title: 'Health First',
    description: 'We prioritize nutrition and health in all our products, using natural ingredients and whole grains.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary-600" />,
    title: 'Community Focus',
    description: 'We are committed to supporting our local community through employment and sustainable practices.',
  },
  {
    icon: <Award className="w-8 h-8 text-primary-600" />,
    title: 'Quality Excellence',
    description: 'Every product is carefully crafted and tested to meet the highest quality standards.',
  },
  {
    icon: <Target className="w-8 h-8 text-primary-600" />,
    title: 'Innovation',
    description: 'We continuously innovate to bring you new and improved healthy food options.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Vitafoods360
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Your trusted partner for fresh, healthy bakery products and nutritional services
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Vitafoods360 was founded with a simple yet powerful mission: to provide our community 
                with fresh, healthy, and delicious bakery products that support a nutritious lifestyle.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Starting as a small family business, we have grown to become a trusted name in Sierra Leone's 
                food industry. Our commitment to quality, health, and community has remained unchanged since day one.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to innovate and expand our product range while maintaining our core values 
                of health, quality, and community service.
              </p>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
                alt="Our bakery"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide fresh, healthy, and delicious bakery products that promote wellness and 
                support our community's nutritional needs while maintaining the highest standards of quality.
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading provider of healthy bakery products in Sierra Leone, recognized for 
                our commitment to nutrition, quality, and community development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind Vitafoods360
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member) => (
              <StaffCard key={member.id} staff={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
