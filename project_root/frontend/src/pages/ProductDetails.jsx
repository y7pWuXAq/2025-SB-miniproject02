import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import { qualityDetails } from '../assets/qualityDetails';  // 품질 상태 기준 불러오기

const ProductDetails = () => {
    const { products, navigate, currency, addToCart, removeFromCart, cartItems } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    useEffect(() => {
        if (products.length > 0 && product) {
            let productsCopy = products.filter(
                (item) => item.category === product.category && item._id !== product._id
            );
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [products, product]);

    useEffect(() => {
        setThumbnail(product?.image[0] || null);
    }, [product]);

    if (!product) return null;

    const discountRate = product.price && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    const isSoldOut = !product.inStock;

    return (
        <div className="mt-12">
            <p>
                <Link to="/">Home</Link> /
                <Link to="/products"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>
                    <h3>저자 : {product.author} / 출판사 : {product.publisher}</h3>
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img
                                key={i}
                                src={i < 5 ? assets.star_icon : assets.star_dull_icon}
                                alt=""
                                className="md:w-4 w-3.5"
                            />
                        ))}
                        <p className="text-base ml-2">(5)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">
                            정가 : {currency} {product.price.toLocaleString('ko-KR')}
                        </p>
                        <p className="text-2xl font-medium">
                            판매가 : {currency} {product.offerPrice.toLocaleString('ko-KR')}
                        </p>
                        {discountRate > 0 && (
                            <span className="text-primary">
                                (정가 대비 {discountRate}% 할인)
                            </span>
                        )}
                    </div>

                    {/* 품질 상태 기준에 따른 About Product 자동 표시 */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {(product.description && product.description.length > 0
                            ? product.description
                            : Object.values(qualityDetails[product.qualityLevel]?.criteria || {})
                        ).map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        {isSoldOut ? (
                            <button
                                disabled
                                className="w-full py-3.5 font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                            >
                                품절
                            </button>
                        ) : (
                            <>
                                {cartItems[product._id] ? (
                                    <button
                                        onClick={() => {
                                            removeFromCart(product._id);
                                        }}
                                        className="w-full py-3.5 cursor-pointer font-medium bg-gray-500 text-white hover:bg-gray-500 transition"
                                    >
                                        Added
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                                    >
                                        Add to Cart
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (cartItems[product._id]) {
                                            navigate("/cart");
                                        } else {
                                            addToCart(product._id);
                                            setTimeout(() => navigate("/cart"), 100);
                                        }
                                    }}
                                    className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition"
                                >
                                    Buy now
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* -------- related products -------- */}
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts
                        .filter((p) => p.inStock)
                        .map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                </div>
                <button
                    onClick={() => {
                        navigate('/products');
                        scrollTo(0, 0);
                    }}
                    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition"
                >
                    See More
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
