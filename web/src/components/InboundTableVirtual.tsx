import React, { memo, useCallback, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import type { Inbound } from '../types/inbound';
import { formatTraffic } from '../utils/format';
import { Switch } from './ui/Switch';
import { useInboundStore } from '../store/useInboundStore';
import { useModalStore } from '../store/useModalStore';
import { useDialogStore } from '../store/useDialogStore';
import { useQRCodeStore } from '../store/useQRCodeStore';
import { Dropdown, DropdownItem } from './ui/Dropdown';
import { QrCode, RefreshCw, Edit3, Trash2, Copy } from 'lucide-react';
import { generateShareLink, copyToClipboard } from '../utils/linkUtils';
import { toast } from 'react-hot-toast';

interface InboundTableVirtualProps {
    inbounds: Inbound[];
    isEmbedded?: boolean;
}

const ROW_HEIGHT = 100;

interface VirtualInboundRowProps {
    virtualRow: any;
    item: Inbound;
    measureElement: (el: HTMLElement | null) => void;
    onReset: (id: string) => void;
    onEdit: (item: Inbound) => void;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onQRCode: (item: Inbound) => void;
    onCopy: (item: Inbound) => void;
}

const VirtualInboundRow = memo<VirtualInboundRowProps>(({
    virtualRow,
    item,
    measureElement,
    onReset,
    onEdit,
    onDelete,
    onToggle,
    onQRCode,
    onCopy
}) => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            data-index={virtualRow.index}
            ref={measureElement}
            className={`border-b border-gray-100 absolute top-0 left-0 w-full ${isMenuOpen ? 'z-50' : 'z-auto'}`}
            style={{
                transform: `translateY(${virtualRow.start}px)`,
            }}
        >
            <div className="flex items-center px-8 py-6 hover:bg-gray-50 transition-colors h-full whitespace-nowrap">
                <div className="flex-[2.5] min-w-0">
                    <span className="text-[15px] font-bold text-gray-900 tracking-tight truncate block">
                        {item.remark}
                    </span>
                </div>

                <div className="flex-1 min-w-0 px-4 flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 leading-none">
                        {item.protocol}
                    </span>
                </div>

                <div className="flex-1 min-w-0 px-4 text-center">
                    <span className="text-[14px] font-bold text-gray-900 tabular-nums">
                        {item.port}
                    </span>
                </div>

                <div className="flex-2 min-w-0 px-4">
                    <div className="flex flex-col gap-0.5 text-[12px] font-bold tabular-nums">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">↑ {formatTraffic(item.up)}</span>
                            <span className="text-gray-600">↓ {formatTraffic(item.down)}</span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                            / <span className={item.total > 0 ? "text-blue-500" : "text-gray-400"}>
                                {item.total > 0 ? formatTraffic(item.total) : '∞'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 px-4 flex justify-center">
                    <Switch checked={item.enable} onChange={() => onToggle(item.id)} />
                </div>

                <div className="flex-2 min-w-0 px-4">
                    <div className="flex items-center justify-end pr-2">
                        <Dropdown onOpenChange={setIsMenuOpen}>
                            <DropdownItem
                                onClick={() => onCopy(item)}
                                icon={<Copy size={16} strokeWidth={2.5} />}
                            >
                                {t('inbound.actions.copy_link')}
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => onQRCode(item)}
                                icon={<QrCode size={16} strokeWidth={2.5} />}
                            >
                                {t('inbound.actions.qrcode')}
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => onReset(item.id)}
                                icon={<RefreshCw size={16} strokeWidth={2.5} />}
                            >
                                {t('inbound.actions.reset')}
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => onEdit(item)}
                                icon={<Edit3 size={16} strokeWidth={2.5} />}
                            >
                                {t('inbound.actions.edit')}
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => onDelete(item.id)}
                                variant="danger"
                                icon={<Trash2 size={16} strokeWidth={2.5} />}
                            >
                                {t('inbound.actions.delete')}
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
});

export const InboundTableVirtual: React.FC<InboundTableVirtualProps> = memo(({ inbounds, isEmbedded }) => {
    const { t } = useTranslation();
    const toggleEnable = useInboundStore(s => s.toggleEnable);
    const deleteInbound = useInboundStore(s => s.deleteInbound);
    const resetTraffic = useInboundStore(s => s.resetTraffic);
    const { openModal } = useModalStore();

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: inbounds.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 5,
    });

    const handleToggle = useCallback((id: string) => {
        toggleEnable(id);
    }, [toggleEnable]);

    const handleDelete = useCallback((id: string) => {
        useDialogStore.getState().showConfirm(
            t('inbound.confirm.delete_msg'),
            () => {
                deleteInbound(id);
                toast.success(t('inbound.confirm.delete_success'));
            },
            t('inbound.confirm.delete_title')
        );
    }, [deleteInbound, t]);

    const handleReset = useCallback((id: string) => {
        useDialogStore.getState().showConfirm(
            t('inbound.confirm.reset_msg'),
            () => {
                resetTraffic(id);
                toast.success(t('inbound.confirm.reset_success'));
            },
            t('inbound.confirm.reset_title')
        );
    }, [resetTraffic, t]);

    const handleEdit = useCallback((item: Inbound) => {
        openModal(item);
    }, [openModal]);

    const handleQRCode = useCallback((item: Inbound) => {
        useQRCodeStore.getState().open(item);
    }, []);

    const handleCopy = useCallback((item: Inbound) => {
        const link = generateShareLink(item);
        copyToClipboard(link).then(success => {
            if (success) toast.success(t('inbound.confirm.copy_success'));
            else toast.error(t('inbound.confirm.copy_failed'));
        });
    }, [t]);

    const containerStyles = isEmbedded
        ? "w-full"
        : "bg-white border border-gray-200 rounded-5xl shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-1000";

    return (
        <div className={containerStyles}>
            <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                    <div
                        ref={parentRef}
                        className="overflow-y-auto overflow-x-hidden relative"
                        style={{ height: '600px' }}
                    >
                        <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center py-5 px-8">
                                <div className="flex-[2.5] min-w-0">
                                    <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                        {t('inbound.table.remark')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 px-4 text-center">
                                    <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                        {t('inbound.table.type')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 px-4 text-center">
                                    <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                        {t('inbound.table.port')}
                                    </span>
                                </div>
                                <div className="flex-[1.5] min-w-0 px-4">
                                    <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                        {t('inbound.table.traffic')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 px-4 text-center">
                                    <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                        {t('inbound.table.status')}
                                    </span>
                                </div>
                                <div className="flex-2 min-w-0 px-4">
                                    <div className="flex justify-end pr-2">
                                        <div className="w-10 flex items-center justify-center">
                                            <span className="text-[13px] font-bold tracking-tight text-gray-500">
                                                {t('inbound.table.actions')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                height: `${virtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {virtualizer.getVirtualItems().map((virtualRow) => (
                                <VirtualInboundRow
                                    key={virtualRow.key}
                                    virtualRow={virtualRow}
                                    item={inbounds[virtualRow.index]}
                                    measureElement={virtualizer.measureElement}
                                    onReset={handleReset}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggle={handleToggle}
                                    onQRCode={handleQRCode}
                                    onCopy={handleCopy}
                                />
                            ))}
                        </div>
                    </div>

                    {inbounds.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-gray-400 font-bold tracking-tight text-[15px]">{t('inbound.no_nodes')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

InboundTableVirtual.displayName = 'InboundTableVirtual';
