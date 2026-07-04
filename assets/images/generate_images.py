"""Generate WebP placeholder images for the stationery store."""
from PIL import Image, ImageDraw, ImageFont
import os

base = os.path.dirname(os.path.abspath(__file__))

images = {
    'hero-supplies': (800, 600, '#1565C0', 'School Supplies'),
    'cat-writing': (600, 400, '#1976D2', 'Writing'),
    'cat-art': (600, 400, '#7B1FA2', 'Art & Craft'),
    'cat-office': (600, 400, '#388E3C', 'Office'),
    'cat-backtoschool': (600, 400, '#F57C00', 'Back to School'),
    'cat-tech': (600, 400, '#0097A7', 'Tech Accessories'),
    'cat-gifts': (600, 400, '#C2185B', 'Gifts'),
    'product-pen-set': (400, 400, '#1565C0', 'Pen Set'),
    'product-notebook': (400, 400, '#FFD600', 'Notebook'),
    'product-markers': (400, 400, '#E53935', 'Markers'),
    'product-stapler': (400, 400, '#546E7A', 'Stapler'),
    'product-backpack': (400, 400, '#5D4037', 'Backpack'),
    'product-calculator': (400, 400, '#37474F', 'Calculator'),
    'product-scissors': (400, 400, '#00897B', 'Scissors'),
    'product-glue': (400, 400, '#FFA726', 'Glue Sticks'),
    'product-ruler': (400, 400, '#29B6F6', 'Ruler Set'),
    'product-pencils': (400, 400, '#FF7043', 'Colored Pencils'),
    'product-folder': (400, 400, '#AB47BC', 'Folders'),
    'product-highlighter': (400, 400, '#FFEE58', 'Highlighters'),
    'product-eraser': (400, 400, '#EC407A', 'Erasers'),
    'product-detail-main': (600, 600, '#1565C0', 'Premium Pen Set'),
    'bundle-elementary': (500, 350, '#42A5F5', 'Elementary Bundle'),
    'bundle-middle': (500, 350, '#66BB6A', 'Middle School'),
    'bundle-high': (500, 350, '#EF5350', 'High School'),
    'bundle-office': (500, 350, '#78909C', 'Office Starter'),
    'bundle-art': (500, 350, '#AB47BC', 'Art Studio'),
    'bundle-college': (500, 350, '#26A69A', 'College Prep'),
    'blog-study-tips': (600, 400, '#5C6BC0', 'Study Tips'),
    'blog-art-ideas': (600, 400, '#EC407A', 'Art Ideas'),
    'blog-office-org': (600, 400, '#26A69A', 'Office Org'),
    'blog-bullet-journal': (600, 400, '#FFA726', 'Bullet Journal'),
    'blog-eco-supplies': (600, 400, '#66BB6A', 'Eco Supplies'),
    'blog-digital-tools': (600, 400, '#42A5F5', 'Digital Tools'),
    'team-ceo': (300, 300, '#1565C0', 'Sarah Chen'),
    'team-ops': (300, 300, '#FFD600', 'James Wilson'),
    'team-buyer': (300, 300, '#7B1FA2', 'Maria Garcia'),
    'team-support': (300, 300, '#00897B', 'David Kim'),
    'brand-pilot': (200, 80, '#E3F2FD', 'Pilot'),
    'brand-staedtler': (200, 80, '#E8F5E9', 'Staedtler'),
    'brand-moleskine': (200, 80, '#FFF3E0', 'Moleskine'),
    'brand-fiskars': (200, 80, '#FCE4EC', 'Fiskars'),
    'brand-postit': (200, 80, '#FFFDE7', 'Post-it'),
    'brand-elmers': (200, 80, '#E0F7FA', 'Elmers'),
    'about-store': (700, 500, '#1565C0', 'Our Store'),
    'bulk-hero': (800, 400, '#0D47A1', 'Bulk Orders'),
}

for name, (w, h, color, text) in images.items():
    img = Image.new('RGB', (w, h), color)
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('arial.ttf', max(16, min(w, h) // 12))
    except OSError:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    fill = '#333333' if color in ('#FFD600', '#FFEE58', '#FFFDE7', '#FFFFFF') else 'white'
    draw.text(((w - tw) // 2, (h - th) // 2), text, fill=fill, font=font)
    img.save(os.path.join(base, name + '.webp'), 'WEBP', quality=85)

print(f'Generated {len(images)} WebP images.')
