import { MaterialIcon } from "@/components/MaterialIcon";

export function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center text-center px-8 py-14">
      <div className="w-[72px] h-[72px] rounded-[20px] bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-4">
        <MaterialIcon name="search_off" size={34} color="#52525b" />
      </div>
      <h3 className="text-[17px] font-extrabold">No results for "{query}"</h3>
      <p className="text-sm text-[#a1a1aa] mt-2 leading-[1.5] max-w-[260px]" style={{ textWrap: "balance" }}>
        Try a different keyword, or check the spelling.
      </p>
    </div>
  );
}
