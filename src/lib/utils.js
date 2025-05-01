import { clsx } from "clsx" // Removed type: type ClassValue
import { twMerge } from "tailwind-merge"

export function cn(...inputs) { // Removed type: ClassValue[]
  return twMerge(clsx(inputs))
}
