import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { Button, buttonVariants } from "../components/Button"
import { Card, CardDescription, CardTitle } from "../components/Card"
import Wrapper from "../components/Wrapper"
import { cn } from "../lib/utils"
import { Skeleton } from "../components/Skeleton"
import { Icons } from "../components/Icons"
import { useState } from "react"
import { useDebounce } from "../hooks/useDebounce"

interface course {
  _id: string
  title: string
  price: number
}
type Courses = {
  pages: number
  page: number
  courses: course[]
}

function Index() {
  const [query, setQuery] = useState("")
  const deboucedQuery = useDebounce(query)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useLocation().search
  const { isPending, data } = useQuery<Courses>({
    queryKey: ['courses', page, searchParams.get('title')],
    queryFn: () => axios.get(`${import.meta.env.VITE_API_URL}/api/courses${page}`).then((response) => response.data.data),
  })
  const handelSearch = () => {
    if (deboucedQuery !== "")
      setSearchParams({ title: deboucedQuery })
  }
  return (
    <Wrapper className="flex flex-col justify-center items-center pb-20" >
      <div className="flex items-center justify-center w-full max-w-lg mx-auto space-x-3 py-10">
        <input placeholder="Search by course title..." className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
          type="text" onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={handelSearch}>Search</Button>
      </div>
      {isPending ?
        <div className="grid grid-cols-1 px-4 md:px-0 md:grid-cols-3 place-items-center gap-3 pb-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4 w-full max-w-md min-h-[130px]" >
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-20 h-4" />
            </Card>))}
        </div>
        : <div className="grid grid-cols-1 px-4 md:px-0 md:grid-cols-3 place-items-center gap-3 pb-20">
          {data?.courses.map((course: course) => (
            <Link className="w-full" key={course._id} to={`/courses/${course._id}`}>
              <Card className="p-6 space-y-4 w-full max-w-md min-h-[130px]" >
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>Price: {course.price}$</CardDescription>
              </Card>
            </Link>
          ))}
        </div>}
      <div className="flex items-center space-x-4">
        <Link className={cn(buttonVariants({ variant: "outline" }),
          { "pointer-events-none opacity-50": Number(data?.page) === 1 || Number.isNaN(Number(data?.pages)) })}
          to={`?page=${Number(data?.page) - 1}`} ><Icons.LeftArrow /></Link>
        <Link className={cn(buttonVariants({ variant: "outline" }),
          { "pointer-events-none opacity-50": Number(data?.page) === Number(data?.pages) || Number.isNaN(Number(data?.pages)) })}
          to={`?page=${Number(data?.page) + 1}`} ><Icons.RightArrow /></Link>
      </div>
    </Wrapper >
  )
}

export default Index
