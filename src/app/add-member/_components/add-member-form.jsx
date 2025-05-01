
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

// Define Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Invalid email address." }),
  contactInfo: z.string().optional(), // Optional contact info (e.g., phone)
  image: z.instanceof(File).optional().refine(
      (file) => !file || file.size <= 1024 * 1024 * 2, // Example: Max 2MB
      `Image size must be less than 2MB.`
    ).refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      "Only .jpg, .png, .gif, .webp formats are supported."
    ),
});


// Updated function to match the API response structure
async function submitMemberData(data) {
  console.log("Submitting member data via API...");
  try {
    const response = await fetch('/api/members', {
      method: 'POST',
      body: data,
      // Headers are not needed for FormData by default, browser sets Content-Type
    });

    const result = await response.json(); // Parse the JSON response

    if (!response.ok) {
      // Handle HTTP errors (e.g., 400, 500)
      console.error(`API Error: ${response.status}`, result);
      return { success: false, message: result.message || `Request failed with status ${response.status}`, error: result.error };
    }

    console.log("API Response:", result);
    return result; // Return the parsed response

  } catch (error) {
    console.error("Network or fetch error:", error);
    return { success: false, message: "Failed to connect to the server. Please try again.", error: error instanceof Error ? error.message : String(error) };
  }
}

export default function AddMemberForm() {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);
  const fileInputRef = React.useRef(null);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      contactInfo: "",
      image: undefined,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size and type again on client-side for immediate feedback
       const validation = formSchema.shape.image.safeParse(file);
       if (!validation.success) {
            form.setError("image", { type: "manual", message: validation.error.errors[0].message });
            setPreviewImage(null);
             // Optionally clear the input value
             if (fileInputRef.current) fileInputRef.current.value = "";
            return;
       }

      form.setValue("image", file, { shouldValidate: true }); // Trigger validation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("image", undefined);
      setPreviewImage(null);
    }
  };


  async function onSubmit(values) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('role', values.role);
    formData.append('email', values.email);
    if (values.contactInfo) {
      formData.append('contactInfo', values.contactInfo);
    }
    // Only append image if it exists and is a File object
    if (values.image instanceof File) {
      formData.append('image', values.image);
      console.log("Appending image to FormData:", values.image.name);
    } else {
       console.log("No valid image file to append.");
    }

    try {
       // Call the updated function to submit data to the actual API endpoint
       const result = await submitMemberData(formData);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset(); // Reset form fields
        setPreviewImage(null); // Clear image preview
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear file input visually
        }
        // Redirect to the members list page after successful addition
        router.push('/members');
        router.refresh(); // Optional: Force a refresh of the members page data if needed
      } else {
        toast({
          variant: "destructive",
          title: "Error Adding Member",
          description: result.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      // This catch block might be redundant if submitMemberData handles errors,
      // but good for catching unexpected client-side issues during the process.
      console.error("Form submission process error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter member's full name" {...field} required aria-required="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer, Designer" {...field} required aria-required="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter member's email" {...field} required aria-required="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Contact Info Field */}
        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Phone number, LinkedIn profile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
         <FormField
          control={form.control}
          name="image"
          render={({ fieldState }) => ( // Use fieldState to access errors specifically for image
            <FormItem>
              <FormLabel>Profile Image (Optional, Max 2MB)</FormLabel>
              <FormControl>
                <Input
                    type="file"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="file:text-primary file:font-medium hover:file:text-primary/90"
                    aria-describedby="image-form-message" // Link message for accessibility
                />
              </FormControl>
              {previewImage && (
                 <div className="mt-4">
                    <Image
                      src={previewImage}
                      alt="Image preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover border"
                    />
                </div>
              )}
               {/* Display specific error message for the image field */}
               <FormMessage id="image-form-message" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Member...
            </>
          ) : (
            "Add Member"
          )}
        </Button>
      </form>
    </Form>
  );
}
