// Sanity client configuration
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}

// GROQ Queries
export const queries = {
    // Tüm kursları getir
    allCourses: `*[_type == "course"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    price,
    oldPrice,
    category,
    courseType,
    duration,
    isActive,
    isFeatured,
    badges,
    "featuredImage": featuredImage.asset->url,
    "instructor": instructor->{name, title, photo}
  }`,

    // Tek kurs getir
    courseBySlug: `*[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    price,
    oldPrice,
    category,
    courseType,
    duration,
    features,
    badges,
    "featuredImage": featuredImage.asset->url,
    "gallery": gallery[].asset->url,
    "instructor": instructor[]->{name, title, photo, bio}
  }`,

    // Eğitmenler
    allInstructors: `*[_type == "instructor"] | order(order asc) {
    _id,
    name,
    title,
    expertise,
    shortBio,
    "photo": photo.asset->url,
    socialLinks
  }`,

    // Site ayarları
    settings: `*[_type == "siteSettings"][0] {
    siteName,
    "logo": logo.asset->url,
    contact,
    social,
    seo
  }`,

    // Header
    header: `*[_type == "header"][0] {
    navItems,
    ctaButton
  }`,

    // Footer
    footer: `*[_type == "footer"][0] {
    columns,
    bottomText,
    trustBadges
  }`,
}
