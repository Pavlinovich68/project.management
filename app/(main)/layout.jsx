import {Providers} from "@/context/Provider";

export default function AppLayout({ children }) {
   return (
      <Providers>
            {children}
      </Providers>
   );
}
