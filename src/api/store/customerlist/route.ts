import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  // Query to get products and count of customers who bought them
  const { data: productPurchases } = await query.graph({
    entity: "orders",
    fields: ["items.product.description", "items.product.id", "customer_id","items.product.title"],
  })

  // Extract customer IDs and product descriptions
  const customerIds = productPurchases.flatMap((purchase: any) =>
    purchase.items.map((item: any) => purchase.customer_id)
  )

  const productData = productPurchases.flatMap((purchase: any) =>
    purchase.items.map((item: any) => ({
      productId: item.product.id,
      productName: item.product.title,
      customerId: purchase.customer_id,
    }))
  )

  // Query customer data
  const { data: customers } = await query.graph({
    entity: "customers",
    fields: ["id", "first_name"],
    filters: {
      id: customerIds,
    },
  })

  // Map customers by ID for quick lookup
  const customerMap = customers.reduce((acc: any, customer: any) => {
    acc[customer.id] = customer.first_name
    return acc
  }, {})

  // Group data by product
  const groupedData = productData.reduce((acc: any, item: any) => {
    if (!acc[item.productId]) {
      acc[item.productId] = {
        product_name: item.productName,
        customer_bought_first_name: [],
      }
    }
    acc[item.productId].customer_bought_first_name.push(customerMap[item.customerId])
    return acc
  }, {})

  // Convert grouped data to an array
  const result = Object.values(groupedData)

  // Send the response
  res.json(result)
}
