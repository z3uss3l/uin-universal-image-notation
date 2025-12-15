import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_uin_mcp():
    async with stdio_client(StdioServerParameters(
        command="python",
        args=["mcp_server.py"]
    )) as (read, write):
        async with ClientSession(read, write) as session:
            tools = await session.list_tools()
            print(f"Verfügbare Tools: {[t.name for t in tools]}")
            
            # Teste extract_edges
            result = await session.call_tool(
                "extract_edges",
                {"image_path": "examples/test.jpg"}
            )
            print(f"Result: {result}")

asyncio.run(test_uin_mcp())
