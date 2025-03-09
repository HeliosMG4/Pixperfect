"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useTransition } from "react";
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { updateCredits } from "@/lib/actions/user.actions";
import MediaUploader from "./MediaUploader";
import { toast } from "sonner";
import TransformedImage from "./TransformedImage";
import { set } from "mongoose";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { ArchiveIcon, AreaChartIcon } from "lucide-react";
import { addImage, updateImage } from "@/lib/actions/image.action";
import { useRouter } from "next/navigation";


export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) => {
  const transformationType = transformationTypes[type];

  // State Variables
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();
  const router = useRouter( )

  // Initial Values
  const initialValues = data && action === "Update"
    ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
      }
    : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
   setIsSubmitting(true);
   if(data || image) {
    const transformationUrl = getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId ?? "", 
      ...transformationConfig,
    })
    const imageData = {
      title: values.title,
      publicId: image?.publicId,
      transformationType: type,
      width: image?.width,
      height: image?.height,
      config: transformationConfig,
      secureURL: image?.secureURL,
      transformationURL: transformationUrl,
      aspectRatio: values.aspectRatio,
      prompt: values.prompt,
      color: values.color,
    }
   if( action === 'Add'){
    try {
      const newImage = await addImage({
        image: imageData,
        userId,
        path: '/'
      })
     if(newImage){
      form.reset()
      setImage(data)
      router.push(`/transformations/${newImage._id}`)
     }


    } catch (error) {
      console.log(error);
      
    }
   }

   if(action === 'Update')
    try {
      const updatedImage = await updateImage({
        image: {
          ...ImageData,
          _id: data._id,
          title: "",
          publicId: "",
          transformationType: "",
          width: 0,
          height: 0,
          config: undefined,
          secureURL: "",
          transformationURL: "",
          aspectRatio: undefined,
          prompt: undefined,
          color: undefined
        },
        userId,
        path: `/transformations/${data}`
      })
      if (updatedImage && updatedImage._id) {
        router.push(`/transformations/${updatedImage._id}`); // ✅ Correct
      } else {
        console.error("Error: Updated image does not have an `_id`.");
      }
      


    } catch (error) {
      console.log(error);
      
    }

    
    
   }
   setIsSubmitting(false)
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    onChangeField(value);
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setNewTransformation(transformationType.config);
  };
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    onChangeField(value);
  
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)(); // <-- Immediately invoke the debounced function
  };
  
  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(deepMergeObjects(newTransformation || {}, transformationConfig || {}));
    setNewTransformation(null);
    startTransition(async () => {
      await updateCredits(userId, creditFee);
      toast.success("Transformation applied successfully!");
    });
  };
  useEffect(()=>{
    if(image && (type === 'restore'  || type ==='removeBackground')){
      setNewTransformation(transformationType.config)
    }
  },[image, transformationType.config, type])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}>
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />
          <TransformedImage
          image={image ||{}}
          type={type}
          title={form.getValues().title}
          isTransforming={isTransforming}
          setIsTransforming={setIsTransforming}
          transformationConfig={transformationConfig}
          
          />
        
        </div>

        <div className="flex flex-col gap-4">
          <Button type="button" className="submit-button capitalize" disabled={isTransforming || newTransformation === null} onClick={onTransformHandler}>
            {isTransforming ? "Transforming..." : "Apply Transformation"}
          </Button>

          <Button type="submit" className="submit-button capitalize" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
