import { Button } from "@components/button";
import { Skeleton } from "@components/ui/skeleton";
import { PencilLine } from "lucide-react";
import Image from "next/image";

function LoadingPage() {
  return (
    <div className="px-6 w-full h-full">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-[60%] mb-6" />
          <Skeleton className="h-10 w-20 mb-4" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <div className="border-t pt-4">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
    </div>
  );
}

const ProfileDetails = ({ isLoading = false }) => {
  const user = {
    firstName: 'Jane',
    lastName: 'Cooper',
    email: 'janecooper@gmail.com',
    phone: '(239) 555-0108',
    country: 'New Jersey',
    cityState: '2464 Royal Ln. Mesa',
    postalCode: 'RTX 8908',
    taxId: 'AS55550108',
    role: 'Web Designer',
  };

  return (
    isLoading ? (
      <LoadingPage />
    ) : (
      <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Image
                  src="/default-profile.jpg"
                  alt="Profile"
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">Usuário</p>
              </div>
            </div>
            <Button className="flex items-center">
              <PencilLine className="mr-1" />
              Editar
            </Button>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Minha conta</h3>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="text-gray-800">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sobrenome</p>
                <p className="text-gray-800">{user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="text-gray-800">{user.phone}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-gray-800">{user.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City / State</p>
                <p className="text-gray-800">{user.cityState}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Postal Code</p>
                <p className="text-gray-800">{user.postalCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax ID</p>
                <p className="text-gray-800">{user.taxId}</p>
              </div>
            </div>
          </div>
      </>
    )
  );
};

export default ProfileDetails;