import React, { useEffect, useState } from 'react';
import { c } from './util';
import { decodeBuffer } from './util/decode';
import { Badge } from './Badge';

const useBuffer = (buffer) => {
	const [blob, setBlob] = useState(null);
	useEffect(() => {
		const url = decodeBuffer(buffer);
		setBlob(url);
		return () => URL.revokeObjectURL(url);
	}, [buffer]);
	if (!buffer) return null;
	return blob;
};

export const Image = ({
	item,
	getUrl,
	url,
	alt,
	ar = 1,
	className,
	base64Png,
	buffer,
	onError = () => null,
	fit = 'cover',
	children,
	round,
	variant,
	badge,
}) => {
	const [ready, setReady] = useState(false);
	const blobUrl = useBuffer(buffer);

	const getSrc = () => {
		if (url) return url;
		if (item && getUrl) return getUrl(item, variant);
		if (blobUrl) return blobUrl;
		if (base64Png) return `data:image/png;base64,${base64Png}`;
	};

	const renderImg = () => {
		const url = getSrc();
		if (!url) return null;
		return (
			<img
				src={url}
				className="img-real"
				alt={alt}
				draggable={false}
				onError={() => onError(item)}
				onLoad={() => setReady(true)}
			/>
		);
	};

	return (
		<div
			className={c('img', fit, className, round && 'round', variant, ready ? 'img-ready' : 'img-loading')}
			style={{aspectRatio: ar}}
		>
			{renderImg()}
			{badge ? <Badge number={badge}/> : null}
			{children ? <div className="img-inside">{children}</div> : null}
		</div>
	);
};
