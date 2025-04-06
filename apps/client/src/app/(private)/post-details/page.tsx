'use client';
import React, { Suspense } from 'react';

import PostDetailsContainer from './postDetailsContainer';

export default function PostDetails() {
	return (
		<Suspense>
			<PostDetailsContainer />
		</Suspense>
	);
}
