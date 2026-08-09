import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import type { ProductDetail } from '@/lib/products'

export function ProductAccordion({ product }: { product: ProductDetail }) {
  const sections = [
    { title: 'Description', content: product.description },
    { title: 'Ingredients', content: product.ingredients },
    { title: 'How to Use', content: product.how_to_use },
    { title: 'Benefits', content: product.benefits },
  ].filter((s) => s.content)

  if (sections.length === 0) return null

  return (
    <Accordion>
      {sections.map((section) => (
        <AccordionItem key={section.title} title={section.title}>
          {section.content}
        </AccordionItem>
      ))}
    </Accordion>
  )
}
