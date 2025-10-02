import Image from 'next/image'

interface Staff {
  id: number
  name: string
  role: string
  bio: string
  image_url: string
}

interface StaffCardProps {
  staff: Staff
}

export default function StaffCard({ staff }: StaffCardProps) {
  return (
    <div className="card text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src={staff.image_url}
          alt={staff.name}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{staff.name}</h3>
      <p className="text-primary-600 font-medium mb-3">{staff.role}</p>
      <p className="text-gray-600 text-sm">{staff.bio}</p>
    </div>
  )
}
