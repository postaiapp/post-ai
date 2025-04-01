// components/editUser/editUserUi.jsx
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { BaseSyntheticEvent } from "react";
import { Controller } from "react-hook-form";

const EditUser = ({
  onSubmit,
  handleCancel,
  control,
}: {
  user: any;
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  handleEditState: (state: string) => void;
  handleCancel: () => void;
  control: any;
}) => {

  return (
    <form onSubmit={onSubmit} className="h-full flex flex-col w-full">
      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm text-gray-500">
              Nome
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-gray-500">
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm text-gray-500">
              Telefone
            </Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  id="phone"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="cpf" className="text-sm text-gray-500">
              CPF
            </Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <Input
                  id="cpf"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Seção "Endereço" */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country" className="text-sm text-gray-500">
              País
            </Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Input
                  id="country"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-sm text-gray-500">
              Cidade / Estado
            </Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  id="city"
                  {...field}
                  className="mt-1"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCancel()}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default EditUser;