import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PHLevel({ ph }) {
  return (
    <Card className="w-full h-40">
      <CardHeader>
        <CardTitle className="text-white text-xl font-semibold flex items-center justify-center gap-2">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              pH Level
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="items-center font-bold text-xl text-center flex flex-col justify-center gap-4">
        {`${ph} pH scale`}
      </CardContent>
    </Card>
  );
}

export default PHLevel;
