import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import formSchema from "../schemas/formSchema.json";
import DynamicField from "../components/DynamicField";

function buildZodSchema(field) {
  switch (field.type) {
    case "text": {
      let schema = z.string();
      if (field.validation?.required) schema = schema.min(1, "This field is required");
      if (field.validation?.min) schema = schema.min(field.validation.min, `Minimum ${field.validation.min} characters`);
      if (field.validation?.max) schema = schema.max(field.validation.max, `Maximum ${field.validation.max} characters`);
      return schema;
    }

    case "select": {
      let schema = z.string();
      if (field.validation?.required) schema = schema.min(1, "This field is required");
      return schema;
    }

    case "checkbox": {
      let schema = z.boolean();
      if (field.validation?.required) schema = schema.refine((v) => v === true, "This field is required");
      return schema;
    }

    case "object": {
      const shape = {};
      field.fields?.forEach((sub) => {
        shape[sub.name] = buildZodSchema(sub).optional();
      });
      return z.object(shape);
    }

    default:
      return z.any();
  }
}

function buildRootSchema(schema) {
  const shape = {};
  schema.fields.forEach((field) => {
    shape[field.name] = buildZodSchema(field).optional();
  });

  let root = z.object(shape);

  // Add conditional validation based on show_if
  root = root.superRefine((values, ctx) => {
    schema.fields.forEach((field) => {
      if (field.show_if && field.validation?.required) {
        const dep = field.show_if.field;
        const expected = field.show_if.equals;
        const actual = values[dep];
        const target = values[field.name];

        if (actual === expected && (!target || target === "")) {
          ctx.addIssue({
            path: [field.name],
            code: z.ZodIssueCode.custom,
            message: `${field.label} is required`,
          });
        }
      }
    });
  });

  return root;
}

export default function DynamicForm() {
  const dynamicSchema = useMemo(() => buildRootSchema(formSchema), [formSchema]);

  useEffect(() => {
    console.log("Dynamic schema (rebuild on JSON change):", dynamicSchema);
  }, [dynamicSchema]);

  const methods = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {},
  });

  const { handleSubmit, watch } = methods;
  const watchAll = watch();

  const onSubmit = (values) => {
    alert("Payload: " + JSON.stringify(values, null, 2));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Volunteer Application</h1>
      <p className="text-sm text-green-700 mb-6">
        Fill out this form to apply as an intern/mentor. The form is driven by a JSON schema and validates dynamically.
      </p>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {formSchema.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              formValues={watchAll}
            />
          ))}

          <button
            type="submit"
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Submit Application
          </button>
        </form>
      </FormProvider>

      <div className="mt-8 rounded border bg-gray-50 p-4">
        <h2 className="font-semibold">Current Form Values</h2>
        <pre className="text-xs">{JSON.stringify(watchAll, null, 2)}</pre>
      </div>
    </div>
  );
}
