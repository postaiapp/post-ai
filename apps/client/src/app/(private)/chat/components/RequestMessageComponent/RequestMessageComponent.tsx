import { Interaction } from '@common/interfaces/chat';

export const RequestMessageComponent = ({ request }: { request: Interaction['request'] }) => {
	return (
		<div className="flex justify-end">
			<div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
				<p className="text-gray-800">{request}</p>
			</div>
		</div>
	);
};
