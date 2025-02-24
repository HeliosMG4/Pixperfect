/* eslint-disable no-unused-vars */

// ====== USER PARAMS
type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  
  type UpdateUserParams = {
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
  };
  
  // ====== IMAGE PARAMS
  type ImageParams = {
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: Record<string, any>;
    secureURL: string;
    transformationURL: string;
    aspectRatio?: string;
    prompt?: string;
    color?: string;
  };
  
  type AddImageParams = {
    image: ImageParams;
    userId: string;
    path: string;
  };
  
  type UpdateImageParams = {
    image: ImageParams & { _id: string };
    userId: string;
    path: string;
  };
  
  type Transformations = {
    restore?: boolean;
    fillBackground?: boolean;
    remove?: {
      prompt: string;
      removeShadow?: boolean;
      multiple?: boolean;
    };
    recolor?: {
      prompt?: string;
      to: string;
      multiple?: boolean;
    };
    removeBackground?: boolean;
  };
  
  // ====== TRANSACTION PARAMS
  type CheckoutTransactionParams = {
    plan: string;
    credits: number;
    amount: number;
    buyerId: string;
  };
  
  type CreateTransactionParams = {
    stripeId: string;
    amount: number;
    credits: number;
    plan: string;
    buyerId: string;
    createdAt: Date;
  };
  
  type TransformationTypeKey =
    | "restore"
    | "fill"
    | "remove"
    | "recolor"
    | "removeBackground";
  
  // ====== URL QUERY PARAMS
  type FormUrlQueryParams = {
    searchParams: string;
    key: string;
    value: string | number | null;
  };
  
  type UrlQueryParams = {
    params: string;
    key: string;
    value: string | null;
  };
  
  type RemoveUrlQueryParams = {
    searchParams: string;
    keysToRemove: string[];
  };
  
  type SearchParamProps = {
    params: { id: string; type: TransformationTypeKey };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  type TransformationFormProps = {
    action: "Add" | "Update";
    userId: string;
    type: TransformationTypeKey;
    creditBalance: number;
    data?: ImageParams | null;
    config?: Transformations | null;
  };
  
  type TransformedImageProps = {
    image: Record<string, any>;
    type: string;
    title: string;
    transformationConfig: Transformations | null;
    isTransforming: boolean;
    hasDownload?: boolean;
    setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
  };
  