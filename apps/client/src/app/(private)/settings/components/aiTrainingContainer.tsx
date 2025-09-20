'use client';

import { useState } from 'react';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Separator } from '@components/ui/separator';
import { Badge } from '@components/ui/badge';
import { Upload, Sparkles, Palette, Building2 } from 'lucide-react';
import Image from 'next/image';
import { ChromePicker } from 'react-color';

export default function AITrainingContainer() {
	const [companyDescription, setCompanyDescription] = useState('');
	const [selectedColor, setSelectedColor] = useState('#8B5CF6');
	const [logoPreview, setLogoPreview] = useState<string | null>(null);

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setLogoPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex flex-col gap-4 h-full">
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

			<div className="flex flex-col gap-4 flex-1 overflow-y-auto">
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
						<Textarea
							id="company-description"
							placeholder="Ex: Somos uma empresa de tecnologia focada em soluções inovadoras para pequenas e médias empresas. Oferecemos serviços de desenvolvimento web, aplicativos móveis e consultoria em transformação digital..."
							value={companyDescription}
							onChange={(e) => setCompanyDescription(e.target.value)}
							className="min-h-[100px] resize-none bg-white"
						/>
						<p className="text-xs text-gray-500">
							{companyDescription.length}/500 caracteres
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
								{logoPreview ? (
									<Image
										src={logoPreview}
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
						<div className="flex items-center gap-4">
							<div className="flex flex-col gap-2">
								<Label className="text-sm font-medium text-gray-700">
									Cor principal
								</Label>
								<div className="flex items-center gap-3">
									<div
										className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
										style={{ backgroundColor: selectedColor }}
										onClick={() => {
											const input = document.getElementById('color-picker') as HTMLInputElement;
											input?.click();
										}}
									/>
									<div className="flex flex-col">
										<span className="text-sm font-medium text-gray-700">
											{selectedColor}
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
								color={selectedColor}
								onChange={(color) => setSelectedColor(color.hex)}
								disableAlpha
								className="!shadow-none !border-0"
							/>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}
