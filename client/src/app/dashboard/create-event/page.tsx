"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { useCreateEvent, useMe } from "@/utils/query";
import {
  type EventBasic,
  eventBasicSchema,
  type EventDetails,
  eventDetailsSchema,
  type EventTickets,
  eventTicketsSchema,
  type FullEvent,
} from "@/zod/schema";
import { GrNotes } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import { LuTicket } from "react-icons/lu";
import { useEdgeStore } from "@/lib/edgestore";
import {
  UploaderProvider,
  type UploadFn,
} from "@/components/upload/uploader-provider";
import { SingleImageDropzone } from "@/components/upload/single-image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BiArrowBack } from "react-icons/bi";

interface EventFormStore {
  step: number;
  formData: Partial<FullEvent>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FullEvent>) => void;
  resetForm: () => void;
}

const useEventFormStore = create<EventFormStore>((set) => ({
  step: 1,
  formData: {
    isPaid: false,
    tickets: [],
  },
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () =>
    set({
      step: 1,
      formData: { isPaid: false, tickets: [] },
    }),
}));

export default function CreateEventPage() {
  const router = useRouter();
  const { data, isLoading } = useMe();
  const { edgestore } = useEdgeStore();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const { step, formData, setStep, updateFormData, resetForm } =
    useEventFormStore();

  const { mutateAsync: handleAddEvent, isPending } = useCreateEvent();

  useEffect(() => {
    if (data?.id && !formData.organizerId) {
      updateFormData({ organizerId: data.id });
    }
  }, [data?.id, formData.organizerId, updateFormData]);

  const handleNext = (data: Partial<FullEvent>) => {
    updateFormData(data);
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onProgressChange,
        options: {
          temporary: true,
        },
      });
      setImageUrl(res.url);
      return res;
    },
    [edgestore],
  );

  const handleSubmit = async (data: Partial<FullEvent>) => {
    if (!imageUrl) {
      toast.error("Please upload a banner image before submitting.", {
        richColors: true,
        position: "top-center",
      });
    }
    await edgestore.publicFiles.confirmUpload({
      url: imageUrl!,
    });
    const finalData = {
      ...formData,
      ...data,
      organizerId: formData.organizerId ?? data.organizerId,
      bannerUrl: imageUrl,
    };
    try {
      await handleAddEvent(finalData as FullEvent);
      toast.success("Event created successfully!", {
        richColors: true,
        position: "top-center",
      });
      resetForm();
      setImageUrl(null);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create event. ${error.message}`, {
          richColors: true,
          position: "top-center",
        });
      }
    }
  };

  const steps = [
    { label: "Basic Info", icon: <GrNotes /> },
    { label: "Details", icon: <CiSettings /> },
    { label: "Tickets", icon: <LuTicket /> },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
        <div className="text-lg text-gray-300 sm:text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Button
          variant={"outline"}
          className="group flex items-center gap-2 border-indigo-500/50 bg-gray-900/80 px-4 py-2 text-sm text-gray-200 backdrop-blur-sm transition-all hover:border-indigo-500 hover:bg-indigo-800 hover:text-gray-100 hover:shadow-lg hover:shadow-indigo-500/20 sm:px-6 sm:py-2.5 sm:text-base"
          onClick={() => router.push("/dashboard")}
        >
          <BiArrowBack className="transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back to Dashboard</span>
        </Button>

        {/* Header */}
        <div className="mt-6 mb-6 px-2 text-center sm:mt-10 sm:mb-8">
          <h1 className="bg-gradient-to-br from-indigo-200 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
            Buat Event Barumu
          </h1>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">
            Ikuti langkah-langkah di bawah untuk membuat event yang menarik!
          </p>
        </div>

        {/* Progress indicator - Mobile optimized */}
        <div className="mb-6 px-2 sm:mb-10">
          <div className="flex items-center justify-between sm:justify-center sm:gap-6">
            {steps.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-base transition-all duration-300 sm:h-12 sm:w-12 sm:text-xl ${
                      step > index + 1
                        ? "border-green-500 bg-green-500 text-white"
                        : step === index + 1
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-gray-600 bg-gray-800 text-gray-400"
                    }`}
                  >
                    {step > index + 1 ? "✓" : item.icon}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-medium sm:mt-2 sm:text-xs ${
                      step >= index + 1 ? "text-indigo-400" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="mx-2 h-0.5 w-26 sm:mx-4 sm:w-24">
                    <div
                      className={`h-full transition-all duration-300 ${
                        step > index + 1 ? "bg-green-500" : "bg-gray-700"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border-1 border-indigo-500 bg-gray-950 p-4 shadow-xl shadow-indigo-500/10 sm:p-8">
          {step === 1 && (
            <Step1BasicInfo onNext={handleNext} initialData={formData} />
          )}
          {step === 2 && (
            <Step2Details
              onNext={handleNext}
              onBack={handleBack}
              initialData={formData}
              uploadFn={uploadFn}
            />
          )}
          {step === 3 && (
            <Step3Tickets
              onSubmit={handleSubmit}
              onBack={handleBack}
              initialData={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Info
function Step1BasicInfo({
  onNext,
  initialData,
}: {
  onNext: (data: EventBasic) => void;
  initialData: Partial<FullEvent>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventBasic>({
    resolver: zodResolver(eventBasicSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 sm:space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-200">
          Event Title
        </label>
        <input
          {...register("title")}
          className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400 sm:text-sm">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-200">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
          placeholder="Describe your event"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400 sm:text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-200">
            Category
          </label>
          <input
            {...register("category")}
            className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
            placeholder="e.g., Technology, Music"
          />
          {errors.category && (
            <p className="mt-1 text-xs text-red-400 sm:text-sm">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-200">
            Location
          </label>
          <input
            {...register("location")}
            className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
            placeholder="Event location"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-400 sm:text-sm">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 sm:py-3 sm:text-base"
      >
        Continue →
      </button>
    </form>
  );
}

// Step 2: Details
function Step2Details({
  onNext,
  onBack,
  initialData,
  uploadFn,
}: {
  onNext: (data: EventDetails) => void;
  onBack: () => void;
  initialData: Partial<FullEvent>;
  uploadFn: UploadFn;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventDetails>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-200">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register("startTime")}
            className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
          />
          {errors.startTime && (
            <p className="mt-1 text-xs text-red-400 sm:text-sm">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-200">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register("endTime")}
            className="w-full rounded-lg border border-purple-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
          />
          {errors.endTime && (
            <p className="mt-1 text-xs text-red-400 sm:text-sm">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-200">
          Banner Image
        </label>
        <div className="flex w-full justify-center overflow-hidden">
          <div className="w-full max-w-full">
            <UploaderProvider uploadFn={uploadFn} autoUpload>
              <SingleImageDropzone
                height={250}
                width={300}
                className="w-full"
                dropzoneOptions={{
                  maxSize: 1024 * 1024 * 5,
                  accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
                }}
              />
            </UploaderProvider>
          </div>
        </div>
        {errors.bannerUrl && (
          <p className="mt-1 text-xs text-red-400 sm:text-sm">
            {errors.bannerUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-lg bg-gray-900 p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register("isPaid")}
            id="isPaid"
            className="h-4 w-4 rounded border-purple-600 bg-gray-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500 sm:h-5 sm:w-5"
          />
          <label
            htmlFor="isPaid"
            className="text-sm font-medium text-gray-200 sm:text-base"
          >
            This is a paid event
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-lg border-2 border-purple-600 bg-transparent py-2.5 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-900/30 sm:flex-1 sm:py-3 sm:text-base"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 sm:flex-1 sm:py-3 sm:text-base"
        >
          Continue →
        </button>
      </div>
    </form>
  );
}

// Step 3: Tickets
function Step3Tickets({
  onSubmit,
  onBack,
  initialData,
}: {
  onSubmit: (data: EventTickets) => void;
  onBack: () => void;
  initialData: Partial<FullEvent>;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventTickets>({
    resolver: zodResolver(eventTicketsSchema),
    defaultValues: {
      tickets: initialData.tickets?.length
        ? initialData.tickets
        : [{ name: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-3 rounded-lg border-2 border-purple-800 bg-gray-900 p-4 shadow-sm sm:space-y-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-200 sm:text-base">
                Ticket Type {index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-full p-1 text-red-400 transition-colors hover:bg-red-900/30"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Ticket Name
              </label>
              <input
                {...register(`tickets.${index}.name`)}
                className="w-full rounded-lg border border-purple-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                placeholder="e.g., Early Bird, VIP"
              />
              {errors.tickets?.[index]?.name && (
                <p className="mt-1 text-xs text-red-400 sm:text-sm">
                  {errors.tickets[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Quantity
                </label>
                <input
                  type="number"
                  {...register(`tickets.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-lg border border-purple-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                  placeholder="100"
                />
                {errors.tickets?.[index]?.quantity && (
                  <p className="mt-1 text-xs text-red-400 sm:text-sm">
                    {errors.tickets[index]?.quantity?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`tickets.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-lg border border-purple-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:px-4 sm:py-3 sm:text-base"
                  placeholder="0.00"
                />
                {errors.tickets?.[index]?.price && (
                  <p className="mt-1 text-xs text-red-400 sm:text-sm">
                    {errors.tickets[index]?.price?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.tickets && !Array.isArray(errors.tickets) && (
        <p className="text-xs text-red-400 sm:text-sm">
          {errors.tickets.message}
        </p>
      )}

      <button
        type="button"
        onClick={() => append({ name: "", quantity: 1, price: 0 })}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-purple-600 bg-gray-950 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:border-purple-500 hover:bg-gray-800 sm:py-3 sm:text-base"
      >
        <span className="text-lg sm:text-xl">+</span> Add Another Ticket Type
      </button>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-lg border-2 border-purple-600 bg-transparent py-2.5 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-900/30 sm:flex-1 sm:py-3 sm:text-base"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 sm:flex-1 sm:py-3 sm:text-base"
        >
          🎉 Create Event
        </button>
      </div>
    </form>
  );
}
