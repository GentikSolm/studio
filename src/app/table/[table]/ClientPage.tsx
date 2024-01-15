"use client";

import { PropsWithChildren } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ClientPage({ children }: PropsWithChildren) {
  return (
    <PanelGroup direction="vertical" className="h-full w-full overflow-hidden">
      <Panel minSize={4.5} defaultSize={0} className='min-h-14'>
        <div id="Buttons" />
      </Panel>
      <PanelResizeHandle className="flex h-2 flex-col justify-center">
        <div className="z-10 h-0.5 bg-gray-600" />
      </PanelResizeHandle>
      <Panel minSize={4.5}>{children}</Panel>
    </PanelGroup>
  );
}
