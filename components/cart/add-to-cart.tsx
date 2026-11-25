"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import type { Dictionary } from "dictionaries";
import { useCart } from "./cart-context";

type Labels = Dictionary["product"];

function SubmitButton({
  availableForSale,
  selectedVariantId,
  labels,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  labels: Labels;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-accent p-4 tracking-wide text-on-accent";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        {labels.outOfStock}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label={labels.selectOption}
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        {labels.addToCart}
      </button>
    );
  }

  return (
    <button
      aria-label={labels.addToCart}
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {labels.addToCart}
    </button>
  );
}

export function AddToCart({
  product,
  labels,
}: {
  product: Product;
  labels: Labels;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        labels={labels}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
