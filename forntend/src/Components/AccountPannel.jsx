import { useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "./ui/button";
import { useToast } from "./Toast/use-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAddresses } from "@/app/addressSlice";
import { Trash2 } from "lucide-react";
import { FaSpinner } from "react-icons/fa";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import OrdersSection from "./OrderSection";

const states = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpaschim",
];

const cities = {
  Koshi: [
    "Biratnagar",
    "Dharan",
    "Itahari",
    "Damak",
    "Birtamod",
    "Inaruwa",
    "Urlabari",
  ],

  Madhesh: ["Janakpur", "Birgunj", "Lahan", "Rajbiraj", "Siraha", "Malangawa"],

  Bagmati: [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Hetauda",
    "Chitwan",
    "Banepa",
    "Dhulikhel",
  ],

  Gandaki: ["Pokhara", "Gorkha", "Baglung", "Waling", "Beni"],

  Lumbini: ["Butwal", "Bhairahawa", "Nepalgunj", "Tansen", "Ghorahi", "Lamahi"],

  Karnali: ["Birendranagar", "Jumla", "Dailekh", "Kalikot", "Mugu"],

  Sudurpashchim: [
    "Dhangadhi",
    "Mahendranagar",
    "Dadeldhura",
    "Tikapur",
    "Amargadhi",
  ],
};

export default function AccountPanel({
  addresses,
  onSetDefault,
  onAddAddress,
  currUser,
}) {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "Nepal",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [activeAddressIndex, setActiveAddressIndex] = useState(-1);
  const [isMakingDefault, setIsMakingDefault] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  const handleMakeDefault = async (addressId, index) => {
    setIsMakingDefault(true);
    setActiveAddressIndex(index);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses/${addressId}/default`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(fetchAddresses());
      toast({
        title: "Success",
        description: "Address made default",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsMakingDefault(false);
      setActiveAddressIndex(-1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/address/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(fetchAddresses());
      toast({
        title: "Success",
        description: "Address added successfully",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId, index) => {
    setIsDeletingAddress(true);
    setActiveAddressIndex(index);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/address/${addressId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(fetchAddresses());
      toast({
        title: "Success",
        description: "Address deleted successfully",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        type: "error",
      });
    } finally {
      setIsDeletingAddress(false);
      setActiveAddressIndex(-1);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <div className="border-b border-border pb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Profile
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Username</p>
            <p className="text-lg font-semibold text-foreground">
              {currUser?.userName}
            </p>
          </div>
        </div>
      </div>
      <OrdersSection/>
      {/* Addresses Section */}
      <div className="border-b border-border pb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
          Addresses
        </h2>

        {addresses.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No addresses yet. Add one below.
          </p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address, index) => (
              <label
                key={address._id}
                className={`flex items-start gap-3 p-4 border max-w-xl rounded-lg cursor-pointer transition-all ${
                  !isMakingDefault && address.isDefault
                    ? "border-blue-400 bg-blue-500/5"
                    : "border-border hover:border-blue-400/50"
                }`}
              >
                <input
                  type="radio"
                  name="default-address"
                  checked={address.isDefault}
                  onChange={() => handleMakeDefault(address._id, index)}
                  className="mt-1.5 h-4 w-4 accent-blue-500 flex-shrink-0"
                />
                <div
                  className={`flex-1 min-w-0 ${
                    isMakingDefault && activeAddressIndex === index
                      ? "blur-md"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <p className="font-semibold text-foreground">
                        {address.street}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAddress(address._id, index);
                      }}
                    >
                      {!isDeletingAddress && (
                        <span className="flex items-center justify-center p-2 rounded-full hover:bg-red-100/55 transition-all duration-300">
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </span>
                      )}
                      {isDeletingAddress && activeAddressIndex === index && (
                        <span className="flex items-center justify-center p-2 rounded-full hover:bg-red-100/55 transition-all duration-300">
                          <FaSpinner className="h-4 w-4 animate-spin text-red-500 hover:text-red-600" />
                        </span>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.isDefault && (
                    <p className="text-xs font-semibold text-blue-400 mt-2">
                      Default Address
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Form */}
      <div className="max-w-xl">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
          Add Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`bg-card ${
                errors.name ? "border-red-500" : "border-border"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Street
            </label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main St"
              className={`bg-card ${
                errors.street ? "border-red-500" : "border-border"
              }`}
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-500">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-foreground mb-2"
              >
                State
              </label>
              <Select
                name="state"
                value={formData.state}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    state: value,
                    city: "", // Reset city when state changes
                  }));
                  // Clear error when state is selected
                  if (errors.state) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.state;
                      return newErrors;
                    });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <SelectValue placeholder="Select a state" id="state" />
                </SelectTrigger>
                <SelectContent className="min-h-[40px]">
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-foreground mb-2"
              >
                City
              </label>
              <Select
                name="city"
                value={formData.city}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    city: value,
                  }));
                  // Clear error when city is selected
                  if (errors.city) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.city;
                      return newErrors;
                    });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <SelectValue placeholder="Select a city" id="city" />
                </SelectTrigger>
                <SelectContent className="min-h-[40px]">
                  {formData.state
                    ? cities[formData.state].map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))
                    : []}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Country
            </label>
            <Select disabled={true} value={formData.country} name="country">
              <SelectTrigger
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <SelectValue placeholder="Select a country" id="country" />
              </SelectTrigger>
              <SelectContent className="min-h-[40px]">
                <SelectGroup>
                  <SelectLabel>Nepal</SelectLabel>
                  <SelectItem value="Nepal">Nepal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white hover:bg-blue-500/90 font-semibold"
          >
            {isSubmitting ? "Adding..." : "Add Address"}
          </Button>
        </form>
      </div>
    </div>
  );
}
