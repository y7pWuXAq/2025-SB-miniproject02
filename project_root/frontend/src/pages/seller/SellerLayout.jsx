import React from 'react'
import { assets } from '../../assets/assets';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const SellerLayout = () => {

    const sidebarLinks = [
        { name : "Add Product", path : "/seller", icon : assets.add_icon },
        { name : "Proudct List", path : "/seller/product-list", icon : assets.product_list_icon },
        { name : "Orders", path : "/seller/orders", icon : assets.order_icon },
    ];


    return (
        <div>
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
                            className={({isActive}) => `flex items-center py-3 px-4 gap-3 
                                ${ isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white"}`
                            }
                        >
                            <img src={item.icon} alt="" className='w-7 h-7'/>
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default SellerLayout