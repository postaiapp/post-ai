'use client';

import { useEffect } from 'react';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Upload, Sparkles, Palette, Building2, Save } from 'lucide-react';
import Image from 'next/image';
import { ChromePicker } from 'react-color';
import { useAITrainingMutation } from '@hooks/useAITraining';
import { User } from '@common/interfaces/user';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@common/schemas/user';

interface AITrainingContainerProps {
	user: User;
}

export default function AITrainingContainer({ user }: AITrainingContainerProps) {
	const aiTrainingMutation = useAITrainingMutation();

	const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			company_description: user?.company_description || '',
			company_logo_url: user?.company_logo_url || '',
			brand_color: user?.brand_color || '#8B5CF6',
		},
	});

	const watchedValues = watch();

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setValue('company_logo_url', result);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (data: any) => {
		await aiTrainingMutation.mutateAsync(data);
	};

	// Atualizar os valores quando o usuário mudar
	useEffect(() => {
		setValue('company_description', user?.company_description || '');
		setValue('brand_color', user?.brand_color || '#8B5CF6');
		setValue('company_logo_url', user?.company_logo_url || '');
	}, [user, setValue]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full flex-1">
			<div className="flex flex-col gap-4 flex-1 overflow-y-auto thin-scrollbar">
				{/* Header dentro da área scrollável */}
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
						<Sparkles className="text-purple-500" size={20} />
						Personalização da IA
					</h2>
					<p className="text-sm text-gray-600">
						Personalize como a IA do Post AI Intelligence criará as imagens dos seus posts.
					</p>
				</div>

				<Separator />
				{/* Seção de Descrição da Empresa */}
				<div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
					<div className="flex items-center gap-2 mb-4">
						<Building2 className="text-purple-500" size={20} />
						<h3 className="text-lg font-semibold text-gray-900">Descrição da Empresa</h3>
					</div>
					<div className="space-y-2">
						<Label htmlFor="company-description" className="text-sm font-medium text-gray-700">
							Conte-nos sobre sua empresa, produtos e serviços
						</Label>
						<Controller
							name="company_description"
							control={control}
							render={({ field }) => (
								<Textarea
									id="company-description"
									placeholder="Ex: Somos uma empresa de tecnologia focada em soluções inovadoras para pequenas e médias empresas. Oferecemos serviços de desenvolvimento web, aplicativos móveis e consultoria em transformação digital..."
									className="min-h-[100px] resize-none bg-white"
									{...field}
								/>
							)}
						/>
						<p className="text-xs text-gray-500">
							{watchedValues.company_description?.length || 0}/500 caracteres
						</p>
					</div>
				</div>

				{/* Seção de Logo da Empresa */}
				<div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
					<div className="flex items-center gap-2 mb-4">
						<Upload className="text-purple-500" size={20} />
						<h3 className="text-lg font-semibold text-gray-900">Logo da Empresa</h3>
					</div>
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
								{watchedValues.company_logo_url ? (
									<Image
										src={watchedValues.company_logo_url}
										alt="Logo preview"
										width={64}
										height={64}
										className="object-contain rounded"
									/>
								) : (
									<Upload className="text-gray-400" size={24} />
								)}
							</div>
							<div className="flex-1">
								<Label htmlFor="logo-upload" className="cursor-pointer">
									<div className="flex items-center gap-2 p-3 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
										<Upload size={16} />
										<span className="text-sm font-medium">Escolher arquivo</span>
									</div>
								</Label>
								<input
									id="logo-upload"
									type="file"
									accept="image/*"
									onChange={handleLogoUpload}
									className="hidden"
								/>
								<p className="text-xs text-gray-500 mt-1">
									PNG, JPG ou SVG. Máximo 2MB.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Seção de Cores da Marca */}
				<div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
					<div className="flex items-center gap-2 mb-4">
						<Palette className="text-purple-500" size={20} />
						<h3 className="text-lg font-semibold text-gray-900">Cores da Marca</h3>
					</div>
					<div className="space-y-4">
						<Controller
							name="brand_color"
							control={control}
							render={({ field }) => (
								<>
									<div className="flex items-center gap-4">
										<div className="flex flex-col gap-2">
											<Label className="text-sm font-medium text-gray-700">
												Cor principal
											</Label>
											<div className="flex items-center gap-3">
												<div
													className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
													style={{ backgroundColor: field.value }}
													onClick={() => {
														const input = document.getElementById('color-picker') as HTMLInputElement;
														input?.click();
													}}
												/>
												<div className="flex flex-col">
													<span className="text-sm font-medium text-gray-700">
														{field.value}
													</span>
													<Badge variant="secondary" className="w-fit">
														Cor selecionada
													</Badge>
												</div>
											</div>
										</div>
									</div>
									<div className="flex justify-center">
										<ChromePicker
											color={field.value}
											onChange={(color) => field.onChange(color.hex)}
											disableAlpha
											className="!shadow-none !border-0"
										/>
									</div>
								</>
							)}
						/>
					</div>
				</div>
			</div>

			{/* Botão de salvar fixo na parte inferior */}
			<div className="mt-4 pt-4 border-t border-gray-200">
				<Button
					type="submit"
					disabled={aiTrainingMutation.isPending}
					className="w-full px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
				>
					{aiTrainingMutation.isPending ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
							Salvando...
						</>
					) : (
						<>
							<Save size={18} className="mr-2" />
							Salvar Configurações
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
