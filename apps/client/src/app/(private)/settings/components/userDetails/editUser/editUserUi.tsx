// components/editUser/editUserUi.jsx
import { User } from "@common/interfaces/user";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { formatCpfCnpj } from "@utils/cpf";
import { formatPhoneBR } from "@utils/phone";
import { BaseSyntheticEvent } from "react";
import { Controller } from "react-hook-form";

const EditUser = ({
  onSubmit,
  handleCancel,
  control,
  isLoading,
  errors
}: {
  user: User | null | undefined;
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  handleEditState: (state: string) => void;
  handleCancel: () => void;
  control: any;
  isLoading: boolean;
  errors: any;
}) => {

  return (
    <form onSubmit={onSubmit} className="h-full flex flex-col w-full">
      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm text-gray-500" required>
              Nome
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="Jhon Doe"
                  required
                  disabled={isLoading}
                  {...field}
                  className="my-1"
                />
              )}
            />
            {errors?.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-gray-500" required>
              Email
            </Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={isLoading}
                  required
                  placeholder="jhondoe@email.com"
                  id="email"
                  type="email"
                  {...field}
                  className="my-1"
                />
              )}
            />
            {errors?.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
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
                  disabled={isLoading}
                  placeholder="(00) 00000-0000"
                  {...field}
                  onChange={(e) => {
                    const { value } = e.target;
                    field.onChange(formatPhoneBR(value));
                  }}
                  className="my-1"
                />
              )}
            />
            {errors?.phone && (
              <span className="text-red-500 text-sm">{errors.phone.message}</span>
            )}
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
                  className="my-1"
                  placeholder="000.000.000-00"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => {
                    const { value } = e.target;
                    field.onChange(formatCpfCnpj(value));
                  }}
                />
              )}
            />
            {errors?.cpf && (
              <span className="text-red-500 text-sm">{errors.cpf.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
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
                  disabled={isLoading}
                  id="country"
                  placeholder="Brasil"
                  {...field}
                  className="my-1"
                />
              )}
            />
            {errors?.country && (
              <span className="text-red-500 text-sm">{errors.country.message}</span>
            )}
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
                  disabled={isLoading}
                  id="city"
                  placeholder="Recife/PE"
                  {...field}
                  className="my-1"
                />
              )}
            />
            {errors?.city && (
              <span className="text-red-500 text-sm">{errors.city.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-auto gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCancel()}
          disabled={isLoading}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600"
          disabled={isLoading}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default EditUser;