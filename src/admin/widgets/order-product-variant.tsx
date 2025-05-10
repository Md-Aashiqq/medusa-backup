// src/admin/widgets/order-product-variant.tsx

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Container, Heading, Text } from "@medusajs/ui"

const OrderProductVariantWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Order Products & Variants</Heading>
      </div>
      <div className="px-6 py-4">
        {order.items.map((item) => (
          <div key={item.id} className="mb-2">
            <Text size="small" weight="plus">
              Product: {item.product_title || "-"}
            </Text>
            <br />
            <Text size="small">
              Variant: {item.variant?.title || "-"}
            </Text>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before", // Injects at the top of the order details page
})

export default OrderProductVariantWidget
