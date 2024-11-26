const API_URL =
    process.env.NEXT_PUBLIC_API_AUTH || "http://localhost:5000/api/";

type Store = {
    _id: string;
    owner_id: string;
    store_name: string;
    image_link: string;
    location: string;
    latitude: number;
    longitude: number;
    contact_info: string;
    opening_hours: string;
    description: string;
};

type Product = {
    _id: string;
    name: string;
    description?: string;
    price: number;
    image_link?: string;
    store_id: string;
};

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        headers: {
            "Content-Type": "application/json",
            // Add any default headers here
        },
        // Include credentials if needed
        // credentials: 'include',
        ...options,
    };


    try {
        const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);
        console.log(`${API_URL}${endpoint}`);
        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error;
            } catch {
                errorMessage = `HTTP error! status: ${response.status}`;
            }
            throw new ApiError(response.status, errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
    }
};

// API endpoints
export const api = {
    stores: {
        getAll: () => fetchApi("stores"),
        getById: (id: string) => fetchApi(`stores/${id}`),
        create: (data: Partial<Store>) =>
            fetchApi("stores", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<Store>) =>
            fetchApi(`stores/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        delete: (id: string) =>
            fetchApi(`stores/${id}`, {
                method: "DELETE",
            }),
    },
    products: {
        getAll: () => fetchApi("products"),
        getByStore: (storeId: string) => fetchApi(`products/store/${storeId}`),
        getById: (id: string) => fetchApi(`products/${id}`),
        create: (data: Partial<Product>) =>
            fetchApi("products", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<Product>) =>
            fetchApi(`products/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        delete: (id: string) =>
            fetchApi(`products/${id}`, {
                method: "DELETE",
            }),
    },
};
