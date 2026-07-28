// helper to extract displayable string name from populated user field
export function getDisplayName(
    user: string | Record<string,any> | null | undefined,
    fallback: string = "System"
): string {
    if (!user) return fallback;

    if (typeof user === "string") {
        return user.trim() || fallback;
    }

    // for populated object
    if (typeof user === "object"){
        return (
            user.userId ||
            user.firstName ||
            user.lastName ||
            fallback
        );
    }

    return String(user);
}

