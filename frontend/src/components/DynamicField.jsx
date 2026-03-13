import { useFormContext, useWatch } from "react-hook-form";

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function shouldShowField(field, formValues) {
  if (!field.show_if) return true;

  const { field: depField, equals } = field.show_if;
  const current = getValueByPath(formValues, depField);
  return current === equals;
}

export default function DynamicField({ field, parentName, formValues }) {
  const { register, formState } = useFormContext();
  const name = parentName ? `${parentName}.${field.name}` : field.name;

  const shouldShow = shouldShowField(field, formValues);
  if (!shouldShow) return null;

  const error = formState.errors?.[field.name];
  const nestedError = parentName
    ? formState.errors?.[parentName]?.[field.name]
    : undefined;

  const displayError = nestedError || error;

  switch (field.type) {
    case "text":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <input
            type="text"
            {...register(name)}
            className="w-full rounded border px-3 py-2"
          />
          {displayError?.message && (
            <p className="text-sm text-red-600">{displayError.message}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <select
            {...register(name)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {displayError?.message && (
            <p className="text-sm text-red-600">{displayError.message}</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className="mb-4">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register(name)} />
            <span>{field.label}</span>
          </label>
          {displayError?.message && (
            <p className="text-sm text-red-600">{displayError.message}</p>
          )}
        </div>
      );

    case "object":
    case "section":
      return (
        <fieldset className="mb-4 rounded border border-gray-200 p-4">
          <legend className="px-2 text-sm font-semibold">
            {field.label}
          </legend>
          {field.fields?.map((sub) => (
            <DynamicField
              key={sub.name}
              field={sub}
              parentName={name}
              formValues={formValues}
            />
          ))}
        </fieldset>
      );

    default:
      return null;
  }
}
