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

// Define Zod schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Invalid email address." }),
  contactInfo: z.string().optional(), // Optional contact info (e.g., phone)
  image: z.instanceof(File).optional(), // Allow optional file upload
  // Add other fields if needed
});

type FormValues = z.infer<typeof formSchema>;

// Mock function for backend submission (replace with actual API call)
async function submitMemberData(data: FormData): Promise<{ success: boolean; message: string }> {
  console.log("Submitting data:", Object.fromEntries(data.entries()));
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate success/failure
  // In a real app, this would be:
  // const response = await fetch('/api/members', { method: 'POST', body: data });
  // const result = await response.json();
  // return result;

  const shouldSucceed = Math.random() > 0.2; // 80% success rate for demo
  if (shouldSucceed) {
     return { success: true, message: "Member added successfully!" };
  } else {
     return { success: false, message: "Failed to add member. Please try again." };
  }
}

export default function AddMemberForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      contactInfo: "",
      image: undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("image", undefined);
      setPreviewImage(null);
    }
  };


  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('role', values.role);
    formData.append('email', values.email);
    if (values.contactInfo) {
      formData.append('contactInfo', values.contactInfo);
    }
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
       // **IMPORTANT**: Replace `submitMemberData` with your actual API call logic
       // using fetch or axios to POST to your backend `/api/members` endpoint.
       const result = await submitMemberData(formData);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset(); // Reset form after successful submission
        setPreviewImage(null); // Clear image preview
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear file input visually
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred. Please check the console.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter member's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer, Designer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter member's email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

         <FormField
          control={form.control}
          name="image"
          render={() => ( // We don't use field directly here, manage through state/ref
            <FormItem>
              <FormLabel>Profile Image (Optional)</FormLabel>
              <FormControl>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="file:text-primary file:font-medium hover:file:text-primary/90"
                />
              </FormControl>
              {previewImage && (
                 <div className="mt-4">
                    <Image
                      src={previewImage}
                      alt="Image preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />


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
