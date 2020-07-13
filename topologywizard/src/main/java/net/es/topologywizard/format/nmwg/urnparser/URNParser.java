package net.es.topologywizard.format.nmwg.urnparser;

import java.util.StringTokenizer;

public class URNParser 
{
	
	    final static public String TOPO_ID_PREFIX    = "urn:ogf:network";
	    final static public String[] TOPO_ID_PARTS   = {"domain", "node", "port", "link"};
	    final static public String TOPO_ID_SEPARATOR = ":";
	    final static public String TOPO_ID_LABEL_SEPARATOR = "=";
	    final static public String TOPO_ID_WILDCARD = "*";
	    final static public int DOMAIN_TYPE = 1;
	    final static public int NODE_TYPE = 2;
	    final static public int PORT_TYPE = 3;
	    final static public int LINK_TYPE = 4;
	    
	    /**
	     * Extracts a URN of the specified type from another URN
	     * 
	     * @param urn the urn to parse
	     * @param type the type of id (domain, node, port, or link) to extract.
	     *   Use the constants suffixed with _TYPE in the class.
	     * @return the extracted ID of the specified type
	     * 
	     */
	    static public String extractID(String urn, int type)
	    {
	        urn = URNParser.normalizeURN(urn);
	        
	        
	        //break urn into parts
	        String[] urnParts = urn.split(TOPO_ID_SEPARATOR);
	        if(urnParts.length < type){
	            System.out.println("the type specified was not present in the URN");
	            return null;
	        }
	      
	        
	        String finalextractedID = null;
	        
		    	
	    	if(type == DOMAIN_TYPE)
	    	{
	    		return urnParts[0];
	    	}
	    	else if(type == NODE_TYPE)
	    	{
	    		return urnParts[1];
	    	}
	    	else if(type == PORT_TYPE)
	    	{
	    		return urnParts[2];
	    	}
	    	else if(type == LINK_TYPE)
	    	{
	    		return urnParts[3];
	    	}

	        return finalextractedID;

	    }
	    
	    
	    /**
	     * Normalizes a URN by trimming whitespace, converting to lowercase, removing the prefix, 
	     * and all labels such as <i>partType=</i>.
	     * 
	     * @param urn the URN to normalize
	     * @return the normalized URN
	     */
	    static public String normalizeURN(String urn){
	        urn = urn.trim();
	        urn = urn.toLowerCase();
	        urn = urn.replaceAll(TOPO_ID_PREFIX+TOPO_ID_SEPARATOR, "");
	        for(String part : TOPO_ID_PARTS){
	            urn = urn.replaceAll(part+TOPO_ID_LABEL_SEPARATOR, "");
	        }
	        
	        return urn;
	    }
	       
	    /**
	     * Determines whether a URN is of domain, node, port, or link type.
	     * 
	     * @param urn the URN with the type to extract
	     * @return an int indicating the type. use the constants in this class to identify.
	     */
	    public static int getURNType(String urn)
	    {
	        urn = URNParser.normalizeURN(urn);
	        return urn.split(TOPO_ID_SEPARATOR).length;
	    }
	}


