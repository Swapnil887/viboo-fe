import VariantDetailsPage from "@/components/storePage/VariantDetailPage";

let dummyData = {
    "success": true,
    "message": "Product variant details fetched successfully",
    "data": {
        "id": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
        "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
        "sku": "VIB-TSHIRT-45",
        "barcode": "BR-VIB-TSHIRT-45",
        "weight": "100",
        "isActive": true,
        "createdAt": "2026-11-18T06:56:31.719Z",
        "updatedAt": "2026-11-18T06:56:31.719Z",
        "options": [
            {
                "id": "c489146e-6b05-4f77-9fc9-e9647378ba96",
                "variantId": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
                "optionValueId": "14d4a410-5c89-48cb-aaa6-99077ceba7cd",
                "optionValue": {
                    "id": "14d4a410-5c89-48cb-aaa6-99077ceba7cd",
                    "optionId": "fc1a53f1-6693-4d45-99ed-19102052f106",
                    "value": "4-5 Years",
                    "slug": "4-5-years",
                    "sortOrder": 2,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "option": {
                        "id": "fc1a53f1-6693-4d45-99ed-19102052f106",
                        "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                        "name": "Size",
                        "slug": "size",
                        "createdAt": "2026-11-18T06:37:16.850Z",
                        "updatedAt": "2026-11-18T06:37:16.850Z"
                    }
                }
            }
        ],
        "productPrices": [
            {
                "id": "4a8fd0a1-f19e-4dfb-86ee-d07f074cfd08",
                "variantId": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
                "price": "499",
                "compareAtPrice": "599",
                "currency": "INR",
                "startsAt": "2026-11-18T06:56:31.719Z",
                "endsAt": null,
                "status": "ACTIVE",
                "createdAt": "2026-11-18T06:56:31.719Z",
                "updatedAt": "2026-11-18T06:56:31.719Z"
            }
        ],
        "productImages": [
            {
                "id": "299e87cc-8589-4864-88e0-4f3d4fc933d9",
                "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                "variantId": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
                "imageUrl": "https://your-cdn.com/kids-hat-blue-front.jpg",
                "altText": "Kids blue cotton hat front view",
                "sortOrder": 0,
                "isPrimary": true,
                "createdAt": "2026-11-18T06:56:31.719Z"
            },
            {
                "id": "34e19357-28ff-43dc-b521-e89cc6b97c2a",
                "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                "variantId": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
                "imageUrl": "https://your-cdn.com/kids-hat-blue-side.jpg",
                "altText": "Kids blue cotton hat side view",
                "sortOrder": 1,
                "isPrimary": false,
                "createdAt": "2026-11-18T06:56:31.719Z"
            }
        ],
        "inventories": [
            {
                "id": "14195f13-bc4f-477a-98b5-629439c7dceb",
                "warehouseId": "97e2d5ba-3157-40cc-9bcb-91530a54829a",
                "variantId": "39e5bdb2-6e90-450a-be7f-7086ee72df94",
                "quantity": 10,
                "reservedQuantity": 0,
                "createdAt": "2026-11-18T06:56:31.719Z",
                "updatedAt": "2026-11-18T06:56:31.719Z",
                "warehouse": {
                    "id": "97e2d5ba-3157-40cc-9bcb-91530a54829a",
                    "name": "Main Warehouse",
                    "code": "WH-001",
                    "address": "Indore, Madhya Pradesh, India",
                    "city": null,
                    "state": null,
                    "country": "India",
                    "pincode": null,
                    "isActive": true,
                    "createdAt": "2026-11-02T11:37:46.850Z",
                    "updatedAt": "2026-11-02T11:37:46.850Z"
                }
            }
        ],
        "product": {
            "id": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
            "name": "Pink Cotton T-Shirt",
            "slug": "Pink-Cotton-T-Shirt",
            "description": "Pink Cotton T-Shirt",
            "productType": "PHYSICAL",
            "status": "ACTIVE",
            "brandId": "a8648ca4-e2b0-4166-8098-185f67b2c1d8",
            "isFeatured": true,
            "createdAt": "2026-11-18T06:37:16.850Z",
            "updatedAt": "2026-11-18T06:37:16.850Z",
            "brand": {
                "id": "a8648ca4-e2b0-4166-8098-185f67b2c1d8",
                "name": "Hopscotch",
                "slug": "hopscotch",
                "logoUrl": "https://example.com/logo.png",
                "isActive": true,
                "createdAt": "2026-11-02T11:13:57.871Z",
                "updatedAt": "2026-11-02T11:13:57.871Z"
            },
            "categories": [
                {
                    "id": "ac5bc9cb-9ded-4063-b3dd-36714f072e73",
                    "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                    "categoryId": "60d680ac-124c-4fa8-a191-f8c0d2aa20e7",
                    "isPrimary": false,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "category": {
                        "id": "60d680ac-124c-4fa8-a191-f8c0d2aa20e7",
                        "name": "Clothing",
                        "slug": "clothing",
                        "description": "Clothing category",
                        "imageUrl": null,
                        "parentId": null,
                        "isActive": true,
                        "sortOrder": 1,
                        "createdAt": "2026-11-18T05:48:55.151Z",
                        "updatedAt": "2026-11-18T06:05:36.717Z",
                        "parent": null
                    }
                },
                {
                    "id": "f13da214-a9d7-466c-b915-bbd864119a51",
                    "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                    "categoryId": "9b81bba5-fd60-476e-88d7-ff0a61be0251",
                    "isPrimary": true,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "category": {
                        "id": "9b81bba5-fd60-476e-88d7-ff0a61be0251",
                        "name": "T-shirt",
                        "slug": "t-shirts",
                        "description": "T shirts for all",
                        "imageUrl": null,
                        "parentId": "60d680ac-124c-4fa8-a191-f8c0d2aa20e7",
                        "isActive": true,
                        "sortOrder": 1,
                        "createdAt": "2026-11-18T05:49:50.535Z",
                        "updatedAt": "2026-11-18T05:49:50.535Z",
                        "parent": {
                            "id": "60d680ac-124c-4fa8-a191-f8c0d2aa20e7",
                            "name": "Clothing",
                            "slug": "clothing",
                            "description": "Clothing category",
                            "imageUrl": null,
                            "parentId": null,
                            "isActive": true,
                            "sortOrder": 1,
                            "createdAt": "2026-11-18T05:48:55.151Z",
                            "updatedAt": "2026-11-18T06:05:36.717Z"
                        }
                    }
                }
            ],
            "productAttributes": [
                {
                    "id": "48120211-06cf-4a9c-9743-0a83118fa910",
                    "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                    "attributeId": "d8ce5cd7-3a31-464f-b5d9-0e759c7e5fc0",
                    "attributeValueId": "2d126c53-5998-4a67-baf3-0fe1797289af",
                    "valueText": null,
                    "valueNumber": null,
                    "valueBoolean": null,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "updatedAt": "2026-11-18T06:37:16.850Z",
                    "attribute": {
                        "id": "d8ce5cd7-3a31-464f-b5d9-0e759c7e5fc0",
                        "name": "Fabric",
                        "slug": "fabric",
                        "dataType": "TEXT",
                        "isFilterable": false,
                        "isSearchable": false,
                        "isActive": true,
                        "createdAt": "2026-11-18T06:03:28.583Z",
                        "updatedAt": "2026-11-18T06:03:28.583Z"
                    },
                    "attributeValue": {
                        "id": "2d126c53-5998-4a67-baf3-0fe1797289af",
                        "attributeId": "d8ce5cd7-3a31-464f-b5d9-0e759c7e5fc0",
                        "value": "Cotton",
                        "slug": "cotton",
                        "sortOrder": 0,
                        "createdAt": "2026-11-18T06:03:28.586Z"
                    }
                },
                {
                    "id": "44d9bb51-b426-4674-9ed3-28c5100fd74d",
                    "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                    "attributeId": "6aac7e65-2498-45a4-81fc-3ad1b98d00e6",
                    "attributeValueId": "54393baa-47dd-4f1f-8ff2-bfd6210542be",
                    "valueText": null,
                    "valueNumber": null,
                    "valueBoolean": null,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "updatedAt": "2026-11-18T06:37:16.850Z",
                    "attribute": {
                        "id": "6aac7e65-2498-45a4-81fc-3ad1b98d00e6",
                        "name": "Age Group",
                        "slug": "age-group",
                        "dataType": "TEXT",
                        "isFilterable": false,
                        "isSearchable": false,
                        "isActive": true,
                        "createdAt": "2026-11-18T06:02:39.570Z",
                        "updatedAt": "2026-11-18T06:02:39.570Z"
                    },
                    "attributeValue": {
                        "id": "54393baa-47dd-4f1f-8ff2-bfd6210542be",
                        "attributeId": "6aac7e65-2498-45a4-81fc-3ad1b98d00e6",
                        "value": "4–6 Years",
                        "slug": "4–6-years",
                        "sortOrder": 2,
                        "createdAt": "2026-11-18T06:02:39.573Z"
                    }
                },
                {
                    "id": "155fd83f-53ec-4503-891b-03433c117747",
                    "productId": "5b8bed60-3f74-491b-b36e-6a22ddadd3a6",
                    "attributeId": "b2a81662-ff6f-4ac0-8f7c-1e9db6ad2395",
                    "attributeValueId": "700f357b-b6d3-4cf2-bfde-5c1404a56af9",
                    "valueText": null,
                    "valueNumber": null,
                    "valueBoolean": null,
                    "createdAt": "2026-11-18T06:37:16.850Z",
                    "updatedAt": "2026-11-18T06:37:16.850Z",
                    "attribute": {
                        "id": "b2a81662-ff6f-4ac0-8f7c-1e9db6ad2395",
                        "name": "Gender",
                        "slug": "gender",
                        "dataType": "SELECT",
                        "isFilterable": false,
                        "isSearchable": false,
                        "isActive": true,
                        "createdAt": "2026-11-18T06:01:48.357Z",
                        "updatedAt": "2026-11-18T06:01:48.357Z"
                    },
                    "attributeValue": {
                        "id": "700f357b-b6d3-4cf2-bfde-5c1404a56af9",
                        "attributeId": "b2a81662-ff6f-4ac0-8f7c-1e9db6ad2395",
                        "value": "Girls",
                        "slug": "girls",
                        "sortOrder": 1,
                        "createdAt": "2026-11-18T06:01:48.364Z"
                    }
                }
            ],
            "productImages": []
        }
    }
}

type Props = {
  params: Promise<{
    variant: string;
  }>;
};

export default async function ProductVariantPage({ params }: Props) {
  const { variant } = await params;
  
  const fetchVariantData = async (variant: string) => {
    // Simulate fetching data for the variant
    const fetchVariantData = await fetch(`${process.env.BACKEND_URL}/api/v/variant/${variant}`);

    if (!fetchVariantData.ok) {
      throw new Error('Failed to fetch variant data');
    }

    const data = await fetchVariantData.json();

    return data.data;
  }

  let data = await fetchVariantData(variant)
 

  return <VariantDetailsPage variant={data} />;
}