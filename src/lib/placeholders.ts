export function getGamePlaceholderImage(gameSlug: string): string {
  const normalized = gameSlug?.toLowerCase() || '';
  
  if (normalized.includes('fc26') || normalized.includes('fifa') || normalized.includes('soccer')) {
    return 'https://images.unsplash.com/photo-1518605368461-1e1e38ce7058?w=800&q=80';
  }
  if (normalized.includes('chess')) {
    return 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80';
  }
  if (normalized.includes('cod') || normalized.includes('call-of-duty') || normalized.includes('shooter')) {
    return 'https://images.unsplash.com/photo-1505041042790-21a41cc001b9?w=800&q=80';
  }
  if (normalized.includes('fortnite')) {
    // Controller/Gamer aesthetic
    return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80';
  }
  if (normalized.includes('pubg')) {
    return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';
  }
  if (normalized.includes('gta')) {
    return 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80';
  }
  
  // Generic Cyberpunk/Esports aesthetic fallback
  return 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80';
}
