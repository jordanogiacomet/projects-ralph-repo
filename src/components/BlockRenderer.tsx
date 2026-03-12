import React from 'react'

// Block type definitions
type BlockType =
  | 'heroBlock'
  | 'richContentBlock'
  | 'serviceCardsBlock'
  | 'ctaBlock'
  | 'accordionBlock'
  | 'statsBlock'
  | 'contactFormBlock'
  | 'imageTextBlock'
  | 'clientLogosBlock'
  | 'videoBlock'
  | 'downloadBlock'

interface BlockBase {
  blockType: BlockType
  id?: string
}

interface BlockRendererProps {
  blocks: BlockBase[] | null | undefined
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `block-${index}`

        switch (block.blockType) {
          case 'heroBlock':
            return <HeroBlockComponent key={key} {...block} />
          case 'richContentBlock':
            return <RichContentBlockComponent key={key} {...block} />
          case 'serviceCardsBlock':
            return <ServiceCardsBlockComponent key={key} {...block} />
          case 'ctaBlock':
            return <CTABlockComponent key={key} {...block} />
          case 'accordionBlock':
            return <AccordionBlockComponent key={key} {...block} />
          case 'statsBlock':
            return <StatsBlockComponent key={key} {...block} />
          case 'contactFormBlock':
            return <ContactFormBlockComponent key={key} {...block} />
          case 'imageTextBlock':
            return <ImageTextBlockComponent key={key} {...block} />
          case 'clientLogosBlock':
            return <ClientLogosBlockComponent key={key} {...block} />
          case 'videoBlock':
            return <VideoBlockComponent key={key} {...block} />
          case 'downloadBlock':
            return <DownloadBlockComponent key={key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}

// Placeholder components — will be fully implemented in frontend stories

function HeroBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="hero-block" data-block-type="heroBlock">
      <p>{String(props.subtitle || 'Hero Block')}</p>
    </section>
  )
}

function RichContentBlockComponent(props: Record<string, unknown>) {
  void props
  return (
    <section className="rich-content-block" data-block-type="richContentBlock">
      <p>Rich Content Block</p>
    </section>
  )
}

function ServiceCardsBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="service-cards-block" data-block-type="serviceCardsBlock">
      <p>{String(props.heading || 'Service Cards Block')}</p>
    </section>
  )
}

function CTABlockComponent(props: Record<string, unknown>) {
  return (
    <section className="cta-block" data-block-type="ctaBlock">
      <p>{String(props.heading || 'CTA Block')}</p>
    </section>
  )
}

function AccordionBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="accordion-block" data-block-type="accordionBlock">
      <p>{String(props.heading || 'Accordion Block')}</p>
    </section>
  )
}

function StatsBlockComponent(props: Record<string, unknown>) {
  void props
  return (
    <section className="stats-block" data-block-type="statsBlock">
      <p>Stats Block</p>
    </section>
  )
}

function ContactFormBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="contact-form-block" data-block-type="contactFormBlock">
      <p>{String(props.heading || 'Contact Form Block')}</p>
    </section>
  )
}

function ImageTextBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="image-text-block" data-block-type="imageTextBlock">
      <p>{String(props.imagePosition || 'left')}</p>
    </section>
  )
}

function ClientLogosBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="client-logos-block" data-block-type="clientLogosBlock">
      <p>{String(props.heading || 'Client Logos Block')}</p>
    </section>
  )
}

function VideoBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="video-block" data-block-type="videoBlock">
      <p>{String(props.url || 'Video Block')}</p>
    </section>
  )
}

function DownloadBlockComponent(props: Record<string, unknown>) {
  return (
    <section className="download-block" data-block-type="downloadBlock">
      <p>{String(props.heading || 'Download Block')}</p>
    </section>
  )
}
