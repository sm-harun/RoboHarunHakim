import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import { getProductDetails } from '../utils/api';

const ProductDetailScreen = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const loadProductDetail = async () => {
            if (!productId) {
                setError("Invalid product ID");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getProductDetails(productId);
                setProduct(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProductDetail();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            // Removed Alert but kept the cart addition functionality
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {error ? (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={40} color="#FF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : product ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>{product.name}</Text>
                    </View>

                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="description" size={24} color="#6C63FF" />
                            <Text style={styles.detailText}>{product.description}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="attach-money" size={24} color="#6C63FF" />
                            <Text style={styles.priceText}>{product.price}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={handleAddToCart}
                        >
                            <MaterialIcons name="add-shopping-cart" size={20} color="white" />
                            <Text style={styles.cartButtonText}>Add to Cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <MaterialIcons name="remove-shopping-cart" size={40} color="#888" />
                    <Text style={styles.emptyText}>Product not found</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#F8FAFC',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    header: {
        marginBottom: 25,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D3748',
        textAlign: 'center',
    },
    category: {
        fontSize: 16,
        color: '#718096',
        marginTop: 8,
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    detailText: {
        fontSize: 16,
        color: '#4A5568',
        marginLeft: 15,
        flex: 1,
        lineHeight: 24,
    },
    priceText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D3748',
        marginLeft: 15,
    },
    buttonGroup: {
        marginTop: 25,
        gap: 15,
    },
    cartButton: {
        backgroundColor: '#6C63FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        gap: 10,
    },
    cartButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#EDF2F7',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#2D3748',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FF4444',
        marginVertical: 20,
        textAlign: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#718096',
        marginTop: 20,
    },
});

export default ProductDetailScreen;
/*// components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, Alert, TextInput } from 'react-native';
import { CartContext } from '../context/CartContext'; // Correctly import CartContext
import { useContext } from 'react';

import {getProductDetails} from "../utils/api";
const ProductDetailScreen = ({ route, navigation }) => {

  const { productId } = route.params; // Receive course ID from params
    // const { productId } = route.params || {}; // Make sure to destructure from route.params or set a default value

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use the CartContext and destructure to get addToCart
    const { addToCart  } = useContext(CartContext); // Correctly use useContext to access addToCart

    useEffect(() => {
        const loadProductDetail = async () => {
            if (productId) {
                try {
                    setLoading(true);
                    const response= await getProductDetails(productId);
                    setProduct(response.data);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                    setProduct(null);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error("productId is undefined");
                setLoading(false);
            }
        };

        loadProductDetail();
    }, [productId]); // Run effect whenever productId changes


    const addToCartHandler  = () => {
        // Renaming for clarity
        if (product) { // Ensure product is not null
            addToCart(product);
            Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View>
                <Text>{`Error: ${error}`}</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        );
    }

return (
    <View style={{ padding: 20 }}>
        {product ? ( // Check if product exists
            <>
                <Text style={{ fontSize: 24 }}>{product.name}</Text>
                <Text style={{ marginVertical: 10 }}>{product.description}</Text>
                <Text>Price: ${product.price}</Text>
                {/!*<Text>Status: {product.inStock ? 'In stock' : 'Out of stock'}</Text>*!/}
                <Button title="Add to Cart" onPress={addToCartHandler} />
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </>
        ) : (
            <Text>No product found for ID: {productId}</Text> // Display message if no product is found
        )}
    </View>
);
};

export default ProductDetailScreen;*/
/*    const handleSearch = () => {
        if (productId) {
            setProductId(productId); // Triggers useEffect to fetch new product details
        }
    };*/




/*
    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Enter Product ID"
                value={productId}
                onChangeText={text => setProductId(text)}
                style={{ padding: 10, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
            />
            <Button title="Search Product ID" onPress={handleSearch} />

            {product ? ( // Check if product exists
                <>
                    <Text style={{ fontSize: 24 }}>{product.title}</Text>
                    <Text style={{ marginVertical: 10 }}>{product.description}</Text>
                    <Text>Price: ${product.price}</Text>
                    <Text>Status: {product.status}</Text>
                    <Button title="Add to Cart" onPress={addToCartHandler} />
                    <Button title="Go Back" onPress={() => navigation.goBack()} />
                </>
            ) : (
                <Text>No product found for ID: {productId}</Text> // Display message if no product is found
            )}
        </View>
    );
};*/
