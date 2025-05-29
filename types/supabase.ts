export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          rating: number
          total_reviews: number
          user_type: 'renter' | 'sharer'
          verification_status: {
            email: boolean
            phone: boolean
            address: boolean
            social: boolean
          }
          social_links: {
            facebook: string | null
            twitter: string | null
            linkedin: string | null
            instagram: string | null
          }
          profile_picture_required: boolean
          profile_completed: boolean
          stripe_customer_id: string | null
          plaid_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          rating?: number
          total_reviews?: number
          user_type?: 'renter' | 'sharer'
          verification_status?: {
            email: boolean
            phone: boolean
            address: boolean
            social: boolean
          }
          social_links?: {
            facebook: string | null
            twitter: string | null
            linkedin: string | null
            instagram: string | null
          }
          profile_picture_required?: boolean
          profile_completed?: boolean
          stripe_customer_id?: string | null
          plaid_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          rating?: number
          total_reviews?: number
          user_type?: 'renter' | 'sharer'
          verification_status?: {
            email: boolean
            phone: boolean
            address: boolean
            social: boolean
          }
          social_links?: {
            facebook: string | null
            twitter: string | null
            linkedin: string | null
            instagram: string | null
          }
          profile_picture_required?: boolean
          profile_completed?: boolean
          stripe_customer_id?: string | null
          plaid_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          sharer_id: string
          departure_city: string
          arrival_city: string
          departure_date: string
          arrival_date: string
          airline: string | null
          flight_number: string | null
          space_length: number
          space_width: number
          space_height: number
          space_unit: string
          weight_limit: number
          weight_unit: string
          item_count: number
          price: number
          currency: string
          accepted_categories: string[] | null
          restrictions: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sharer_id: string
          departure_city: string
          arrival_city: string
          departure_date: string
          arrival_date: string
          airline?: string | null
          flight_number?: string | null
          space_length: number
          space_width: number
          space_height: number
          space_unit: string
          weight_limit: number
          weight_unit: string
          item_count: number
          price: number
          currency: string
          accepted_categories?: string[] | null
          restrictions?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sharer_id?: string
          departure_city?: string
          arrival_city?: string
          departure_date?: string
          arrival_date?: string
          airline?: string | null
          flight_number?: string | null
          space_length?: number
          space_width?: number
          space_height?: number
          space_unit?: string
          weight_limit?: number
          weight_unit?: string
          item_count?: number
          price?: number
          currency?: string
          accepted_categories?: string[] | null
          restrictions?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          renter_id: string
          name: string
          description: string
          pickup_city: string
          delivery_city: string
          length: number
          width: number
          height: number
          unit: string
          weight: number
          weight_unit: string
          category: string
          value: number
          currency: string
          photos: string[]
          desired_date: string | null
          special_instructions: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          renter_id: string
          name: string
          description: string
          pickup_city: string
          delivery_city: string
          length: number
          width: number
          height: number
          unit: string
          weight: number
          weight_unit: string
          category: string
          value: number
          currency: string
          photos: string[]
          desired_date?: string | null
          special_instructions?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          renter_id?: string
          name?: string
          description?: string
          pickup_city?: string
          delivery_city?: string
          length?: number
          width?: number
          height?: number
          unit?: string
          weight?: number
          weight_unit?: string
          category?: string
          value?: number
          currency?: string
          photos?: string[]
          desired_date?: string | null
          special_instructions?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          trip_id: string | null
          item_id: string | null
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          trip_id?: string | null
          item_id?: string | null
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          trip_id?: string | null
          item_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewed_id: string
          trip_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewed_id: string
          trip_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewed_id?: string
          trip_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}