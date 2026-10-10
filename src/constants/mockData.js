import { BadgeDollarSign, CalendarCheck, Car, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import economyImage from '@/assets/categories/economy.jpg'
import fourByFourImage from '@/assets/categories/four-by-four.jpg'
import luxuryImage from '@/assets/categories/luxury.jpg'
import sedanImage from '@/assets/categories/sedan.jpg'
import suvImage from '@/assets/categories/suv.jpg'
import vanImage from '@/assets/categories/van.jpg'
import aminaImage from '@/assets/people/amina.jpg'
import danielImage from '@/assets/people/daniel.jpg'
import leilaImage from '@/assets/people/leila.jpg'
import { routes } from '@/constants/routes'

export const carCategories = [
  {
    name: 'Economy',
    description: 'Efficient cars for everyday city trips.',
    image: economyImage,
    alt: 'Compact silver hatchback parked on a city street',
  },
  {
    name: 'Sedan',
    description: 'Comfortable seating for longer drives.',
    image: sedanImage,
    alt: 'Pearl white sedan parked beside a city plaza',
  },
  {
    name: 'SUV',
    description: 'Extra space for family and luggage.',
    image: suvImage,
    alt: 'Blue family SUV on a tree-lined avenue',
  },
  {
    name: 'Luxury',
    description: 'A quieter, more refined ride.',
    image: luxuryImage,
    alt: 'Black luxury sedan on a wet city street at dusk',
  },
  {
    name: '4x4',
    description: 'Confident vehicles for rough roads.',
    image: fourByFourImage,
    alt: 'Dark green four-wheel-drive SUV on an open road',
  },
  {
    name: 'Van',
    description: 'Room for groups and extra bags.',
    image: vanImage,
    alt: 'Graphite passenger van parked at a city curb',
  },
]

export const whyChooseUs = [
  {
    icon: Car,
    title: 'Reliable Vehicles',
    text: 'Every vehicle is selected and maintained to provide a dependable driving experience.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent Pricing',
    text: 'Know what you are paying for with clear and straightforward rental pricing.',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Booking',
    text: 'Book your preferred vehicle through a simple and convenient process.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    text: 'Our team is available to help you before, during and after your rental.',
  },
]

export const rentalSteps = [
  { number: '01', title: 'Choose Your Car', text: 'Compare vehicles, seats, and daily rates from the fleet.' },
  { number: '02', title: 'Select Your Dates', text: 'Set your pickup and return details before you continue.' },
  { number: '03', title: 'Confirm Your Booking', text: 'Review the summary and confirm when the desk is ready.' },
  { number: '04', title: 'Enjoy Your Journey', text: 'Collect the keys and drive with a clear handover.' },
]

export const homepageStats = [
  { value: '500+', label: 'Vehicles' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '25+', label: 'Locations' },
  { value: '98%', label: 'Customer Satisfaction' },
]

export const testimonials = [
  {
    quote: 'Booking was simple and the vehicle was exactly as described. The entire experience felt professional.',
    name: 'Amina Yusuf',
    detail: 'City traveler',
    rating: 5,
    image: aminaImage,
    imageAlt: 'Portrait of Amina Yusuf',
  },
  {
    quote: 'The pickup was on time, the car was clean, and the terms were easy to understand before I left.',
    name: 'Daniel Okonkwo',
    detail: 'Business guest',
    rating: 5,
    image: danielImage,
    imageAlt: 'Portrait of Daniel Okonkwo',
  },
  {
    quote: 'We needed extra space for a family weekend. The SUV was comfortable and the desk stayed helpful.',
    name: 'Leila Rahman',
    detail: 'Weekend renter',
    rating: 5,
    image: leilaImage,
    imageAlt: 'Portrait of Leila Rahman',
  },
]

export const faqs = [
  {
    id: 'documents',
    question: 'What documents do I need to rent a car?',
    answer:
      'Bring a valid driving license and a second form of identification. The desk will confirm the exact documents before the keys are released.',
  },
  {
    id: 'specific-vehicle',
    question: 'Can I choose a specific vehicle?',
    answer:
      'You can request a listed vehicle. Confirmation depends on availability for your dates, which will be shown before a reservation is completed.',
  },
  {
    id: 'payment-methods',
    question: 'What payment methods are available?',
    answer:
      'Accepted payment methods will be shown at confirmation. This preview does not process a payment.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel my reservation?',
    answer:
      'Cancellation terms will be displayed before you confirm. This page does not submit or cancel a reservation.',
  },
  {
    id: 'deposit',
    question: 'Is there a security deposit?',
    answer:
      'A refundable security deposit may apply. The amount, when required, is shown with the rental summary before confirmation.',
  },
  {
    id: 'extend',
    question: 'Can I extend my rental period?',
    answer:
      'An extension can be requested before the return time and depends on vehicle availability. Contact the desk to arrange it.',
  },
]

export const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: routes.about },
      { label: 'Our Fleet', to: routes.cars },
      { label: 'Contact', to: routes.contact },
      { label: 'Careers', to: routes.contact },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Car Rental', to: routes.cars },
      { label: 'Long-Term Rental', to: routes.contact },
      { label: 'Corporate Rental', to: routes.contact },
      { label: 'Airport Pickup', to: routes.contact },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', to: '/#faq' },
      { label: 'Terms & Conditions', to: routes.contact },
      { label: 'Privacy Policy', to: routes.contact },
      { label: 'Contact Support', to: routes.contact },
    ],
  },
]

export const contactDetails = [
  { icon: Phone, label: 'Phone', value: '+0 000 000 0000', note: 'Placeholder number' },
  { icon: Mail, label: 'Email', value: 'hello@cityrentalcar.example', note: 'Placeholder email' },
  { icon: MapPin, label: 'Location', value: 'City center desk', note: 'Placeholder address' },
]

export const socialLinks = [
  { name: 'Facebook', mark: 'f' },
  { name: 'Instagram', mark: 'Ig' },
  { name: 'LinkedIn', mark: 'in' },
  { name: 'WhatsApp', mark: 'Wa' },
]
