'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'

const themes = [
  {
    id: 'aurora-tech',
    name: 'Aurora Tech',
    description: 'Modern tech with vibrant gradients',
    preview: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#667eea',
      text: '#ffffff'
    }
  },
  {
    id: 'heritage-serif',
    name: 'Heritage Serif',
    description: 'Classic elegance with serif typography',
    preview: {
      bg: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
      accent: '#8B4513',
      text: '#2c1810'
    }
  },
  {
    id: 'clinic-clean',
    name: 'Clinic Clean',
    description: 'Minimal medical-inspired design',
    preview: {
      bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      accent: '#0ea5e9',
      text: '#1e293b'
    }
  },
  {
    id: 'forest-nature',
    name: 'Forest Nature',
    description: 'Earthy greens and natural tones',
    preview: {
      bg: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
      accent: '#10b981',
      text: '#ffffff'
    }
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Warm oranges and golden hues',
    preview: {
      bg: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)',
      accent: '#ea580c',
      text: '#451a03'
    }
  }
]

interface BrandPickerProps {
  currentTheme: string
}

export default function BrandPicker({ currentTheme }: BrandPickerProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (!theme) return

    const root = document.documentElement
    root.setAttribute('data-theme', themeId)

    // Apply CSS custom properties based on theme
    switch (themeId) {
      case 'aurora-tech':
        root.style.setProperty('--bg', '#0f0f23')
        root.style.setProperty('--card-bg', '#1a1a2e')
        root.style.setProperty('--text', '#ffffff')
        root.style.setProperty('--accent', '#667eea')
        root.style.setProperty('--accent-hover', '#5a67d8')
        root.style.setProperty('--border', '#2d3748')
        break
      case 'heritage-serif':
        root.style.setProperty('--bg', '#faf7f2')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--text', '#2c1810')
        root.style.setProperty('--accent', '#8B4513')
        root.style.setProperty('--accent-hover', '#a0522d')
        root.style.setProperty('--border', '#e2e8f0')
        break
      case 'clinic-clean':
        root.style.setProperty('--bg', '#f8fafc')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--text', '#1e293b')
        root.style.setProperty('--accent', '#0ea5e9')
        root.style.setProperty('--accent-hover', '#0284c7')
        root.style.setProperty('--border', '#e2e8f0')
        break
      case 'forest-nature':
        root.style.setProperty('--bg', '#064e3b')
        root.style.setProperty('--card-bg', '#065f46')
        root.style.setProperty('--text', '#ffffff')
        root.style.setProperty('--accent', '#10b981')
        root.style.setProperty('--accent-hover', '#059669')
        root.style.setProperty('--border', '#047857')
        break
      case 'sunset-warm':
        root.style.setProperty('--bg', '#fef3c7')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--text', '#451a03')
        root.style.setProperty('--accent', '#ea580c')
        root.style.setProperty('--accent-hover', '#dc2626')
        root.style.setProperty('--border', '#fbbf24')
        break
    }
  }

  const handleThemeChange = async (themeId: string) => {
    setLoading(true)
    setSelectedTheme(themeId)
    
    // Apply theme immediately for instant feedback
    applyTheme(themeId)

    try {
      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            brand_theme: themeId,
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error saving theme:', error.message || error)
        }
      }
    } catch (error) {
      console.error('Error updating theme:', error)
    } finally {
      setLoading(false)
    }
  }

  // Apply current theme on component mount
  useEffect(() => {
    applyTheme(selectedTheme)
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTheme === theme.id
                ? 'ring-2 ring-[var(--accent)] shadow-md'
                : 'hover:shadow-sm'
            }`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  style={{ background: theme.preview.bg }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{theme.name}</h4>
                    {selectedTheme === theme.id && (
                      <Check className="w-4 h-4 text-[var(--accent)]" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {loading && (
        <div className="text-sm text-muted-foreground text-center">
          Saving theme preference...
        </div>
      )}
    </div>
  )
}
